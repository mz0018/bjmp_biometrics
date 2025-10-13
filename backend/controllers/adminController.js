import argon2 from "argon2";
import Admin from "../models/AdminModel.js";
import RecognitionLog from "../models/RecognitionLogSchema.js"

export const signupAdmin = async (req, res) => {
  const { first_name, last_name, username, password, retype_password } = req.body;

  try {
    console.log("Admin signup data:", req.body);

    const errors = {};

    if (!first_name) {
      errors.first_name = "First name is required";
    } else if (first_name.length < 2) {
      errors.first_name = "First name must be at least 2 characters";
    }

    if (!last_name) {
      errors.last_name = "Last name is required";
    } else if (last_name.length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
    }

    if (!username) {
      errors.username = "Username is required";
    } else if (username.length < 4) {
      errors.username = "Username must be at least 4 characters";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!retype_password) {
      errors.retype_password = "Retype password is required";
    } else if (password && retype_password && password !== retype_password) {
      errors.retype_password = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ errors: { username: "Username already exists" } });
    }

    const hashed_password = await argon2.hash(password);

    const new_admin = new Admin({
      first_name,
      last_name,
      username,
      password: hashed_password,
    });

    await new_admin.save();

    return res.status(201).json({
      message: "Admin registered successfully!",
      data: {
        id: new_admin._id,
        first_name: new_admin.first_name,
        last_name: new_admin.last_name,
        username: new_admin.username,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res.status(500).json({ message: "Server error, please try again later" });
  }
};

export const signinAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const errors = {};

    if (!username) {
      errors.username = "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ errors: { username: "Invalid username or password" } });
    }

    const isMatch = await argon2.verify(admin.password, password);
    if (!isMatch) {
      return res.status(400).json({ errors: { password: "Invalid username or password" } });
    }

    return res.status(200).json({
      message: "Login successful",
      data: {
        id: admin._id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("Signin Error:", err.message);
    return res.status(500).json({
      errors: { general: "Server error, please try again later" },
    });
  }
};

export const getVisitorsLog = async (req, res) => {
  try {
    const logs = await RecognitionLog.find().sort({ timestamp: -1 });
    return res.status(200).json(logs)
  } catch (err) {
    console.error('Backend Error: ', err);
    res.status(500).json({ error: "Failed to fetch logs", err });
  }
};

export const updateSaveToLogs = async (req, res) => {
  try {
    const log_id = req.params.id;

    const log = await RecognitionLog.findById(log_id);
    if (!log) {
      return res.status(404).json({ error: "Log not found" });
    }

    console.log(
      `Log ${log_id} BEFORE update isSaveToLogs: ${log.isSaveToLogs}`
    );

    log.isSaveToLogs = true;
    await log.save();

    console.log(
      `Log ${log_id} AFTER update isSaveToLogs: ${log.isSaveToLogs}`
    );

    res.status(200).json({
      log_id,
      isSaveToLogs: log.isSaveToLogs,
    });
  } catch (err) {
    console.error("Error updating log:", err);
    res.status(500).json({ error: "Failed to update log state", details: err.message });
  }
};

export const generateReports = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Missing date range",
      });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const logs = await RecognitionLog.find({
      timestamp: { $gte: fromDate, $lte: toDate },
      isSaveToLogs: true,
    })
      .select(
        "visitor_info.name visitor_info.address visitor_info.contact selected_inmate.inmate_name selected_inmate.relationship timestamp"
      )
      .sort({ timestamp: -1 });

    if (!logs.length) {
      return res.status(200).json({
        success: false,
        message: "No data found for selected range.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (err) {
    console.error("Error in generateReports:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



