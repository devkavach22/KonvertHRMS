const getAuthDetails = () => {
    const user_id = localStorage.getItem("user_id");
    const unique_user_id = localStorage.getItem("unique_user_id");
    const email = localStorage.getItem("user_email");

    return {
        user_id: user_id ? Number(user_id) : null,
        unique_user_id,
        email,
    };
};



const Service = {
    getAuthDetails
};

export default Service;
