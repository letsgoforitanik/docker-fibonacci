import React, { useState, useEffect } from "react";
import axios from "axios";
import env from "./env";

export default function App() {

    const [seenIndices, setSeenIndices] = useState([]);
    const [values, setValues] = useState({});
    const [currentIndex, setCurrentIndex] = useState(null);
    
    useEffect(() => fetchSeenIndices() && fetchValues() && undefined, []);
    
    async function fetchSeenIndices() {
        const response = await axios.get("/api/values/all");
        const seenIndices = response.data.map(e => e.number);
        setSeenIndices(seenIndices);
    }

    async function fetchValues() {
        const response = await axios.get("/api/values/current");
        const values = response.data;
        setValues(values);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        await axios.post("/api/values", { index: currentIndex });
    }

    function handleTextChange(event) {
        const current = event.target.value;
        setCurrentIndex(current);
    }

    return (

        <div>
            <form onSubmit={handleFormSubmit}>
                <label>Enter your index</label> &nbsp;
                <input type="text" onChange={handleTextChange} />
                <button type="submit">Submit</button>
            </form>

            <h3>Indices I have seen : </h3>
            <div>{seenIndices.join(',')}</div>

            <h3>Calculated Values so far : </h3>
            {Object.keys(values).map(key => <div key={key}>For value {key}, I calculated {values[key]}</div>)}

        </div>
    );
}