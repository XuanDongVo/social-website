import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Suggestions = () => {
    return (
        <div className="container mt-4">
            <h2>Suggestions</h2>
            <div className="list-group">
                {[1, 2, 3].map((suggestion) => (
                    <a key={suggestion} href="/" className="list-group-item list-group-item-action">
                        Suggested User {suggestion}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Suggestions;