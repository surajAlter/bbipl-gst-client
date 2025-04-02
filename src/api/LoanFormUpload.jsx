//To upload all the loan forms filled to the mongodb server
export const LoanFormUpload = async (data) => {
    console.log("data received in loan form upload", data);
    const url = "http://localhost:5000/loan-forms";
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error(res);
        }

        const result = await res.json();
        return result; // Return the server res
    } catch (error) {
        throw new Error("Error submitting data: " + error.message);
    }
};