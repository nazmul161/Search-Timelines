import { Container, Breadcrumbs, Typography } from '@mui/material';
import { Link } from "react-router-dom";

const TheBreadCrumb = (props) => {
    return (
        <div style={{backgroundColor: 'rgb(0, 61, 91)', height: '65px'}}>
                <Container sx={{paddingTop: "20px"}}>
                    <Breadcrumbs sx={{fontSize: "14px", fontWeight: "bold"}} color="#59b6c7" separator=">">
                        <Link to="/" style={{color: "#fff"}}>{props.titles.split(",")[0]}</Link>
                        <Typography color="#fff" sx={{fontSize: "14px", fontWeight: "bold"}}>{props.titles.split(",")[1]}</Typography>
                    </Breadcrumbs>
                </Container>
            </div>
    );
}

export default TheBreadCrumb;