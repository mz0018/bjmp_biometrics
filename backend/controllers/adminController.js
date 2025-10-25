import argon2 from "argon2";
import Admin from "../models/AdminModel.js";
import RecognitionLog from "../models/RecognitionLogSchema.js";
import InmateModel from "../models/InmateModel.js";
import { saveMugshotAsWebP } from "../helper/uploadMugshots.js";

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
    const { search } = req.query;

    const filter = search
      ? { "visitor_info.name": { $regex: search, $options: "i" } }
      : {};

    let query = RecognitionLog.find(filter).sort({ timestamp: -1 });
    if (!search) query = query.limit(15);

    const logs = await query.lean();

    return res.status(200).json(logs);
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "Failed to fetch logs", err: err.message });
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

export const registerInmate = async (req, res) => {
  try {
    const body = req.body;
    const errors = {};

    const requiredFields = [
      "firstname",
      "middleInitial",
      "lastname",
      "gender",
      "dateOfBirth",
      "nationality",
      "address",
      "civilStatus",
      "height",
      "weight",
      "caseNumber",
      "offense",
      "sentence",
      "courtName",
      "arrestDate",
      "commitmentDate",
      "status",
    ];

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "")
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
    }

    const mugshots = ["mugshot_front", "mugshot_left", "mugshot_right"];
    for (const shot of mugshots) {
      if (!req.files?.[shot])
        errors[shot] = `${shot.replace("_", " ")} is required`;
    }

    if (Object.keys(errors).length)
      return res.status(400).json({ errors });

    const frontPath = await saveMugshotAsWebP(req.files.mugshot_front[0], "front-" + Date.now());
    const leftPath = await saveMugshotAsWebP(req.files.mugshot_left[0], "left-" + Date.now());
    const rightPath = await saveMugshotAsWebP(req.files.mugshot_right[0], "right-" + Date.now());

    const inmate = await InmateModel.create({
      ...body,
      mugshot_front: frontPath,
      mugshot_left: leftPath,
      mugshot_right: rightPath,
    });

    res.status(200).json({
      message: "Inmate registered successfully!",
      inmate,
    });
  } catch (error) {
    console.error("Error registering inmate:", error);
    res.status(500).json({ message: "Error registering inmate" });
  }
};

export const getInmates = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { firstname: { $regex: search, $options: "i" } },
          { lastname: { $regex: search, $options: "i" } },
          { caseNumber: { $regex: search, $options: "i" } },
          {
            $expr: {
              $regexMatch: {
                input: {
                  $concat: [
                    { $ifNull: ["$firstname", ""] },
                    " ",
                    { $ifNull: ["$middleInitial", ""] },
                    " ",
                    { $ifNull: ["$lastname", ""] },
                  ],
                },
                regex: search,
                options: "i",
              },
            },
          },
        ],
      };
    }

    const inmates = await InmateModel.find(
      filter,
    ).sort({ createdAt: -1 });

    res.status(200).json(inmates);
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "Failed to fetch inmates" });
  }
};

export const updateInmateUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const inmate = await InmateModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!inmate) {
      return res.status(404).json({ error: "Inmate not found." });
    }
    
    res.json({ message: "Inmate updated successfully", inmate });
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "Failed to fetch inmates" });
  }
}

export const updateVisitorUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const formattedUpdate = {};
    for (const key in updateData) {
      formattedUpdate[`visitor_info.${key}`] = updateData[key];
    }

    const visitor = await RecognitionLog.findByIdAndUpdate(
      id,
      { $set: formattedUpdate },
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    res.json({ message: "Visitor updated successfully", visitor });
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "Failed to update visitor" });
  }
};
