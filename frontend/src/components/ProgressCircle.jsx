import React from "react";

const cleanPercentage = (percentage) => {
    const tooLow = !Number.isFinite(+percentage) || percentage < 0;
    const tooHigh = percentage > 100;
    return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const Text = ({ value }) => {
    console.log(value)
    return (
        <text
            fill="#5a5e62"
            fontFamily="Inter"
            x="50%"
            y="50%"
            text-anchor="middle"
            dominant-baseline="central"
            textAnchor="middle"
            fontSize={"14px"}
        >
            {value}
        </text>
    );
};

const Circle = ({ colour, pct }) => {
    const r = 18;
    const circ = 2 * Math.PI * r;
    const strokePct = ((100 - pct) * circ) / 100;
    return (
        <circle
            r={r}
            cx={0}
            cy={0}
            fill="transparent"
            stroke={strokePct !== circ ? colour : ""}
            strokeDasharray={circ}
            strokeDashoffset={pct ? strokePct : 0}
            strokeLinecap="round"
        ></circle>
    );
};

const Pie = ({ current, max }) => {
    const pct = cleanPercentage((current / max) * 100);
    const remaining = (max - current);
    const circleColor = (remaining == 0) ? "red" : (remaining <= 20 ? "#ffd400" : "#1d9bf0")
    return (
        <div className="progress-circle-box">
            <div className={`progress-circle ${remaining <= 20 ? "bigger-circle" : ""}`}>
                <svg viewBox="0 0 45 45">
                    <g transform="translate(22, 22) rotate(-90 0 0)">
                        <Circle colour="rgb(47, 51, 54)" />
                        <Circle colour={circleColor} pct={pct} />
                    </g>
                    {(max - current) <= 20 && <Text value={max - current} />}
                </svg>
            </div>
        </div>
    );
};

export default Pie;
