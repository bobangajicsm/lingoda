import React, { useState, useEffect } from "react";
import { Modal, makeStyles, Theme, createStyles } from "@material-ui/core";
import { saveRating, classesUpdate } from "./store";
import { useDispatch } from "react-redux";
import Rating from "@material-ui/lab/Rating";
import { Class } from "./model";

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: "absolute",
            width: 700,
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    })
);

interface RatingModalProps {
    klass: Class;
    userId: number;
}

const RatingModal: React.FC<RatingModalProps> = (props) => {
    const { klass, userId } = props;
    const [open, setOpen] = useState(false);
    const [ratingGiven, setRatingGiven] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleClose = (newValue: number) => {
        setOpen(false);
        setRatingGiven(true);

        if (typeof newValue === "number") {
            void dispatch(
                saveRating({
                    id: klass.id,
                    rating: newValue,
                })
            );
            dispatch(
                classesUpdate({
                    id: klass.id,
                    changes: {
                        rating: {
                            rating: newValue,
                            classId: klass.id,
                        },
                    },
                })
            );
        }
    };

    const modalBody = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">
                Please give rating to the &apos;{klass.topic}&apos; class.
            </h2>
            <p id="simple-modal-description">
                <Rating
                    name="modal-rating"
                    value={0}
                    onChange={(event, newValue) => {
                        handleClose(newValue);
                    }}
                />
            </p>
        </div>
    );

    useEffect(() => {
        const classStartDate = new Date(klass.startsAt).getTime();
        const now = new Date().getTime();

        if (
            !ratingGiven &&
            !klass.rating &&
            now > classStartDate &&
            klass.students.some((student) => student.id === userId)
        ) {
            handleOpen();
        }
    });

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="rating-modal"
            aria-describedby="class-rating-modal"
        >
            {modalBody}
        </Modal>
    );
};

export default RatingModal;
