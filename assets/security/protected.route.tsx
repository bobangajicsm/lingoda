import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "../common/store";
import { getUser } from "./store";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    const user = useSelector(getUser);

    return (
        <Route
            {...rest}
            render={(props) => {
                if (user) {
                    return <Component {...props} />;
                }

                return (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {
                                from: props.location.pathname,
                            },
                        }}
                    />
                );
            }}
        />
    );
};
