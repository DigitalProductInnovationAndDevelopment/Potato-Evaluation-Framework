import React from 'react';

export default function HowTo ()  {
    return (
        <div>
            <h2>How To</h2>
            <video width="100%" controls>
                <source src="how-to.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};
