const getAuthDetails = () => {
    const user_id = localStorage.getItem("user_id");
    const unique_user_id = localStorage.getItem("unique_user_id");

    return {
        user_id: user_id ? Number(user_id) : null,
        unique_user_id,
    };
};



const Service = {
    getAuthDetails
};

export default Service;
