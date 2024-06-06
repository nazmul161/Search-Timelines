import { CircularProgress, Backdrop } from '@mui/material';

const Loading = ({open}) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: 50000000 }}
            open={open}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default Loading;