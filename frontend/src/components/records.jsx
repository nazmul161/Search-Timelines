import { Grid, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RemoveIcon from "@mui/icons-material/Remove";
import IconMapper from "../components/iconmapper";

const Records = (props) => {
  const {
    data,
    getDetails,
    savedDocsList,
    saveDoc,
    removeDoc,
    showLoginRequiredMessage,
    userobj,
    setPageLoading,
    setShowDetails,
    setDetails,
    setShowLoginRequiredMessage,
    setSavedDocsList,
    setSavedDocsItems,
    savedDocsItems,
    query,
    queries,
    searchTopic,
    setHack,
    hack,
    setRefetchQueries,
    extraStyles
  } = props;

  var saveRemoveDoc;
  if (removeDoc != null) saveRemoveDoc = removeDoc;
  else saveRemoveDoc = saveDoc;

  return (
    <div className="resultboxes" style={extraStyles}>
      <Grid container style={{ position: "relative" }}>
        <Grid
          item
          style={{ display: "flex", justifyContent: "center" }}
          md={2}
          sm={12}
          xs={12}
        >
          <img onClick={() => getDetails(data.ControlNumber, setPageLoading, setShowDetails, setDetails)} 
            src={data.ThumbnailURL}
            style={{
              height:180,
              width: 120,
              marginRight: 20,
              marginLeft: 20,
              boxShadow: "0px 0px 4px 2px rgba(0,0,0,0.3)",
              cursor:"pointer"
            }}
          />
        </Grid>
        <Grid
          style={{
            padding: "5px 0px 0px 20px",
            position: "relative",
            textAlign: "left",
          }}
          item
          md={10}
          sm={12}
          xs={12}
        >
          <div
            style={{
              fontSize: "14px",
              color: "green",
              position: "relative",
              float: "right",
              marginTop: 5,
              minWidth: 100,
              paddingLeft: 5,
            }}
          >
            {data.Availability}
          </div>
          <div
            onClick={() =>
              getDetails(
                data.ControlNumber,
                setPageLoading,
                setShowDetails,
                setDetails
              )
            }
            style={{
              fontWeight: 600,
              fontSize: 20,
              fontWeight: "bold",
              color: "#00335b",
              cursor: "pointer",
            }}
          >
            {data.Title}{" "}
            <ArrowForwardIosIcon
              style={{ fontSize: "14px", fontWeight: "bold", color: "#59b6c7" }}
            />
          </div>
          {data.Author != null && data.Author != "" ? (
            <div>—{data.Author}</div>
          ) : (
            ""
          )}
          {data.PublicationDate != null && data.PublicationDate != "" ? (
            <div>{data.PublicationDate}</div>
          ) : (
            ""
          )}
          {data.Format != "" && data.Format != null ? (
            <div className="databoxes">
              <IconMapper format={data.Format} /> &nbsp;
              <span>{data.Format}</span>
            </div>
          ) : (
            ""
          )}
          <Typography
            noWrap={true}
            style={{
              color: "#666",
              textAlign: "justify",
              textJustify: "inter-word",
            }}
          >
            {data.Summary}
          </Typography>
          <br />
          <br />
        </Grid>
        <div
          style={{
            textAlign: "right",
            position: "absolute",
            right: 0,
            bottom: 0,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() =>{
              saveRemoveDoc(
                query,
                userobj._id,
                data,
                setShowLoginRequiredMessage,
                setPageLoading,
                savedDocsList,
                setSavedDocsList,
                searchTopic,
                setHack,
                hack,
                setSavedDocsItems,
                savedDocsItems,
                queries,
              );
              if(setRefetchQueries)
                setRefetchQueries(true);
            }}
            color={
              savedDocsList.indexOf(data.ControlNumber) == -1
                ? "primary"
                : "tertiary"
            }
            startIcon={
              savedDocsList.indexOf(data.ControlNumber) == -1 ? (
                <AddIcon />
              ) : (
                <RemoveIcon />
              )
            }
          >
            {savedDocsList.indexOf(data.ControlNumber) == -1 ? (
              <>Save</>
            ) : (
              <>Remove</>
            )}
          </Button>
          {showLoginRequiredMessage == data.ControlNumber ? (
            <span style={{ color: "red", fontSize: 12 }}>
              <br />
              (Login/SignUp Required)
            </span>
          ) : (
            ""
          )}
        </div>
      </Grid>
    </div>
  );
};

export default Records;
