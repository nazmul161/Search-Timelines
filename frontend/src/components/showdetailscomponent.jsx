import { Modal, Box, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconMapper from '../components/iconmapper';

const ShowDetailsComponent = ({details, showDetails, setShowDetails}) => {
    var availability2 = details.Availability+"";
    return (
        <Modal sx={{zIndex: 40000000, overflow:'scroll'}}
        open={showDetails}
        onClose={() => setShowDetails(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            
            <Box sx={styles.modalStyle}>
                <div style={{backgroundColor: "rgb(0,51,91)", height: "30px", }} onClick={() => setShowDetails(false)}> <CloseIcon style={{color: "white", marginTop: 3, marginLeft: 2}}/> </div>
                <div style={{padding: "20px", margin: "20px", border: "1px solid #aaa"}}>
                        <Grid container style={{position: "relative"}}>
                            <Grid item style={{display: "flex", justifyContent: "center"}} md={2.5} sm={12} xs={12}>
                                <img src={details.ThumbnailURL} style={{height: 220, width: 150, margin: "0px 0px", boxShadow: "0px 0px 4px 2px rgba(0,0,0,0.3)"}} />
                            </Grid>
                            <Grid style={{padding: "5px 0px 0px 0px", position: "relative", textAlign: "left"}} item md={9.5} sm={12} xs={12}>
                                <div style={{fontSize: "14px", color: "green", position: "relative", float: "right", marginTop: 5, minWidth: 100, paddingLeft: 5}}>{availability2.substring(0, availability2.indexOf('('))}</div>
                                <div style={{ fontWeight: 600, fontSize: 20, fontWeight: "bold", color: "#00335b"}}>{details.Title}</div>
                                {(details.Author!=null&&details.Author!="" ? <div>—{details.Author}</div> : '')}
                                {(details.PublicationDate!=null&&details.PublicationDate!="" ? <div>{details.PublicationDate}</div> : '')}
                                {(details.Format!=""&&details.Format!=null ? 
                                    <div className='databoxes'>
                                            <IconMapper format={details.Format} /> &nbsp;
                                            <span>{details.Format}</span>
                                    </div>
                                : '')}

                                <Typography style={{ color: "#666", textAlign: "justify", textJustify: "inter-word"}}>{details.Summary}</Typography>
                            </Grid>
                    </Grid>
                </div>
                <div style={{padding: "0px", margin: "20px", border: "1px solid #aaa"}}>
                    <div style={{backgroundColor: "rgb(0,51,91)", height: "30px", color: "white", fontSize: 18, fontWeight: "bold", padding: "11px 10px 5px 10px"}}>Item Details</div>
                    <Grid container spacing={2} style={{padding: 10}}>
                        {details.ISBN!=""&&details.ISBN!=null ? <Grid item md={6} sm={12} xs={12}>
                            <b>ISBN: </b> {details.ISBN}
                        </Grid> : ''}{details.Series!=""&&details.Series!=null ? <Grid item md={6} sm={12} xs={12}>
                            <b>Series: </b> {details.Series.map(serie => {
                                return (
                                    <span key={serie}>
                                        <br/>- {serie}
                                    </span>
                                );
                            })}
                        </Grid> : ''}{details.Description!=""&&details.Description!=null ? <Grid item md={6} sm={12} xs={12}>
                            <b>Description: </b> {details.Description}
                        </Grid> : ''}{details.Subjects!=""&&details.Subjects!=null ? <Grid item md={6} sm={12} xs={12}>
                            <b>Subjects: </b> {details.Subjects.map(subject => {
                                return (
                                    <span key={subject}>
                                        <br/>- {subject}
                                    </span>
                                );
                            })}
                        </Grid> : ''}{details.Genres!=""&&details.Genres!=null ? <Grid item md={6} sm={12} xs={12}>
                            <b>Genres: </b> {details.Genres.map(genre => {
                                return (
                                    <span key={genre}>
                                        <br/>- {genre}
                                    </span>
                                );
                            })}
                        </Grid> : ''}
                    </Grid>                        
                </div>
            </Box>
        </Modal>
    );
}

const styles = {
    modalStyle : {
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translate(-50%, -20px)',
        width: "calc(100% - 40px)",
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 0,
        maxWidth: 900,
      },
      modalItemDetails: {
        width: "50%",
        display: "inline-block",
        marginBottom: 20,
        verticalAlign: "top"
      }

}

export default ShowDetailsComponent;