const PersonalDetails = () => {

    const options = [
        {
            title: 'Contact info',
        },
        {
            title: 'Birthday',
        },
    ];

    return (
        <>
            
            {options.map(opt => (
                <ul className="text-gray-700" key={opt.title}>
                    <li>{opt.title}</li>
                </ul>
            ))}
            
        </>
    )
}

export default PersonalDetails;