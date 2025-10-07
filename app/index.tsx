import Auth from "./components/Auth/Auth";
import Home from "./Home";
import { View, Text } from "react-native";
import useAuth from "../hooks/useAuth";
import React, { useEffect } from "react";
import _layout from "./_layout";

export default function Index() {
  const { user, initializing } = useAuth();
  const [showHome, setShowHome] = React.useState(false);

  useEffect(() => {
    if (!initializing && user) {
      setShowHome(true);
    }
  }, [user, initializing]);

  if (showHome) return <Home />;
  return (
    <>
      <Auth />
      <_layout />
    </>
  );
}
