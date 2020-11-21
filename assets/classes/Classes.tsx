import { useDispatch, useSelector } from "../common/store";
import { bookClass, cancelClass, fetchClasses, getClasses } from "./store";
import React, { useEffect } from "react";
import { getUser } from "../security/store";
import { Class } from "./model";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from "@material-ui/core";
import { User } from "../security/model";
import Countdown from "../common/Countdown";

const Classes: React.FC = () => {
    const user: User = useSelector(getUser) as User;
    const classes = useSelector(getClasses);
    const dispatch = useDispatch();

    useEffect(() => {
        if (classes.length) {
            return;
        }

        void dispatch(fetchClasses());
    }, [classes.length, dispatch]);

    const isAttending = (klass: Class) =>
        klass.students.some((student) => student.id === user?.id);

    const handleBookClick = (klass: Class) => () => {
        void dispatch(bookClass(klass));
    };

    const handleCancelClick = (klass: Class) => () => {
        void dispatch(cancelClass(klass));
    };

    const getHoursToClass = (endTime: number): number => {
        const total = endTime - new Date().getTime();
        return Math.floor((total / (1000 * 60 * 60)) % 24);
    };

    const formatDate = (dateString: string): string => {
        const newDate = new Date(dateString);
        return newDate.toISOString().slice(0, 10);
    };

    const getClassCountdown = (topic: string, startsAt: number) => {
        return (
            <div className="mb-2">
                <Typography variant="h6">Next Class:</Typography>
                <Typography variant="subtitle1">{topic}</Typography>
                <Typography variant="subtitle1">
                    Starts in: {<Countdown startsAt={startsAt} />}
                </Typography>
            </div>
        );
    };

    const getNextClassCard = (topic: string, startsAt: string) => {
        return (
            <div className="mb-2">
                <Typography variant="h6">Next Class:</Typography>
                <Typography variant="subtitle1">{topic}</Typography>
                <Typography variant="subtitle1">
                    Start date: {startsAt}
                </Typography>
            </div>
        );
    };

    const getNextClass = () => {
        let nextNotBookedClass: Class = null;
        for (let i = 0; i < classes.length; i++) {
            const startsAtDate: Date = new Date(classes[i].startsAt);
            const now = new Date();
            if (startsAtDate.getTime() > now.getTime()) {
                const nextClass = classes[i].students.find(
                    (student) => student.id === user?.id
                );
                if (nextClass) {
                    if (getHoursToClass(startsAtDate.getTime()) < 6) {
                        return getClassCountdown(
                            classes[i].topic,
                            startsAtDate.getTime()
                        );
                    } else {
                        return getNextClassCard(
                            classes[i].topic,
                            formatDate(classes[i].startsAt)
                        );
                    }
                } else {
                    nextNotBookedClass = !nextNotBookedClass
                        ? classes[i]
                        : nextNotBookedClass;
                }
            }
        }
        return !nextNotBookedClass
            ? `No booked classes yet.`
            : `No booked classes yet. Please checkout \`${nextNotBookedClass.topic}\` class.`;
    };

    return (
        <div>
            <Box m={2} width={300}>
                <Card>
                    <CardContent>{getNextClass()}</CardContent>
                </Card>
            </Box>
            <Grid container spacing={2}>
                {classes.map((klass) => (
                    <Grid item xs={6} md={4} lg={3} key={klass.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">
                                    {klass.topic}
                                </Typography>
                                <Typography>
                                    Starts at {klass.startsAt}
                                </Typography>
                                <Typography>Status: {klass.status}</Typography>
                            </CardContent>
                            <CardActions>
                                {isAttending(klass) && (
                                    <Box>
                                        <Typography>
                                            You are attending!
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="default"
                                            onClick={handleCancelClick(klass)}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                )}
                                {!isAttending(klass) &&
                                    (klass.status === "scheduled" ||
                                        klass.status === "cancelled") && (
                                        <div>
                                            <Typography>
                                                You can book it!
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleBookClick(klass)}
                                            >
                                                Book
                                            </Button>
                                        </div>
                                    )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Classes;
