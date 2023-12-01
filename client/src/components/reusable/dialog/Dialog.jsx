import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const CommonDialog = ({ open, onClose, title, content, actions }) => {
  return (
    <>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        { title ? <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
            {title}
        </BootstrapDialogTitle> : ''}
        <DialogContent dividers>
            {content}
        </DialogContent>
        { actions ? <DialogActions>
            {actions}
        </DialogActions> : ''}
      </BootstrapDialog>
    </>
  );
}

CommonDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    content: PropTypes.element,
    actions: PropTypes.element
};

export default CommonDialog;