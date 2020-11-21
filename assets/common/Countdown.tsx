import React, { useState, useRef, useEffect } from "react";

interface CountdownProps {
    startsAt: number;
}

const Countdown: React.FC<CountdownProps> = (props) => {
    const [timeLeft, setTimeLeft] = useState("00:00:00");

    const interval = useRef<number | null>(null);

    const startTimer = () => {
        const countdownDate = props.startsAt; // this should be passed from prop
        interval.current = window.setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(interval.current);
            } else {
                setTimeLeft(`${hours}:${minutes}:${seconds}`);
            }
        }, 1000);
    };

    useEffect(() => {
        startTimer();
        return () => {
            window.clearInterval(interval.current);
        };
    });

    return <span>{timeLeft}</span>;
};

export default Countdown;
