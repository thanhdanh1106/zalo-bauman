import React, { Dispatch, SetStateAction } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LoadingButton } from "@mui/lab";

interface ConfirmDeleteProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<number | null>>;
    isLoading: boolean,
    onSubmit: () => void
}

const ConfirmDelete = ({ open, setOpen, isLoading, onSubmit }: ConfirmDeleteProps) => {

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: 1,
        p: 3,
    };

    const handleClose = () => setOpen(null);

    return (
        <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    TransitionComponent: Fade,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography
                        id="spring-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 600 }}>
                        Xóa dữ liệu
                    </Typography>
                    <Typography id="spring-modal-description" sx={{ mt: 2 }}>
                        Bạn có chắc chắn muốn xóa mục này?
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                        <LoadingButton
                            loading={isLoading}
                            onClick={onSubmit}
                            variant='contained'
                            color='error'>
                            Xác nhận
                        </LoadingButton>
                        <Button
                            onClick={handleClose}
                            variant='contained'
                            color='primary'>
                            Đóng
                        </Button>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ConfirmDelete;


