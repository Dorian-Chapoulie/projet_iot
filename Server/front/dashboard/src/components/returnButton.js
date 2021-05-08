import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

export const ReturnButton = () => {
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };

  return (
    <Button onClick={goBack} className="mx-auto" outline color="info">
      {" "}
      <ArrowBackIcon />{" "}
    </Button>
  );
};
