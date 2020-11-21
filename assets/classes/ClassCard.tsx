import React from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Grid,
    Container,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { Class } from "./model";
import { bookClass, cancelClass } from "./store";
import { useDispatch } from "react-redux";
import RatingModal from "./RatingModal";

interface ClassCardProps {
    klass: Class;
    userId: number;
    isAttending: (klass: Class) => boolean;
}

const ClassCard: React.FC<ClassCardProps> = (props) => {
    const { klass, isAttending, userId } = props;
    const dispatch = useDispatch();
    const handleBookClick = (klass: Class) => () => {
        void dispatch(bookClass(klass));
    };

    const handleCancelClick = (klass: Class) => () => {
        void dispatch(cancelClass(klass));
    };

    return (
        <Card>
            <CardContent>
                <Typography noWrap variant="h5">
                    {klass.topic}
                </Typography>
                <Typography>Starts at {klass.startsAt}</Typography>
                <Typography>Status: {klass.status}</Typography>
            </CardContent>
            <CardActions>
                {isAttending(klass) && (
                    <Container>
                        <Typography>You are attending!</Typography>
                        <Grid
                            container
                            spacing={3}
                            alignItems="center"
                            justify={"space-between"}
                        >
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    color="default"
                                    onClick={handleCancelClick(klass)}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            {klass.rating?.rating && (
                                <Grid item xs={4}>
                                    <Rating
                                        disabled
                                        name="card-rating"
                                        value={klass.rating?.rating}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Container>
                )}
                {!isAttending(klass) &&
                    (klass.status === "scheduled" ||
                        klass.status === "cancelled") && (
                        <div>
                            <Typography>You can book it!</Typography>
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
            <RatingModal klass={klass} userId={userId} />
        </Card>
    );
};

export default ClassCard;
