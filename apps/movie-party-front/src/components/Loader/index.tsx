import React from "react";
import "./loader.css";

const Loader: React.FC = () => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        }}
    >
        <div className="loader" role="status" aria-label="Cargando" />
    </div>
);

export default Loader;
