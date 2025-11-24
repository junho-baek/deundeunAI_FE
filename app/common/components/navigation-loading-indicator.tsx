import * as React from "react";
import { useNavigation } from "react-router";

export function NavigationLoadingIndicator() {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const isBusy =
      navigation.state === "loading" || navigation.state === "submitting";
    if (isBusy) {
      setVisible(true);
      return;
    }
    const timeout = setTimeout(() => setVisible(false), 180);
    return () => clearTimeout(timeout);
  }, [navigation.state]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-[2000] h-1 bg-primary/20">
      <div className="loading-bar h-full w-1/3 rounded-r-full bg-primary" />
    </div>
  );
}

export default NavigationLoadingIndicator;
