import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Stack, Typography, Button, Box, ImageList, ImageListItem, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DatePicker from 'react-date-picker';
import DialogTitle from '@mui/material/DialogTitle';
import Iconify from '../../components/iconify';
import axios from '../../data/httpCommon';
import { formatImageUrl } from '../../utils/formatUrl';
import { formatCurrency } from '../../utils/formatNumber';
import Label from '../../components/label';

export default function SupplierProductDetailPage() {
  const location = useLocation();
  const product = location.state.product;

  const [formData, setFormData] = useState({
    supplierProductId: product.id,
    price: 0,
    amount: 0,
    note: "",
    harvestAt: new Date(),
  });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePurchase = () => {
    console.log(formData);
  }

  const dateStyle = {
    height: '3rem',
    fontSize: '18px',
    backgroundColor: 'info',
    border: '1px solid #d4d9d6',
    borderRadius: 4,
    padding: 16,
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const createNewPurchaseOrder = async (event) => {
    axios
    .post('/api/purchase-orders/create', formData)
    .then((response) => {
      console.log(response.data);
      handleClose();
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Thông tin sản phẩm
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
            Đặt mua sản phẩm
          </Button>
        </Stack>
        <Stack direction="row" spacing={4}>
          <Box sx={{ width: 500, height: 500, border: '1px dashed grey', borderRadius: 4, padding: 2 }}>
            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
              {product.images.map((item) => (
                <ImageListItem key={item.img}>
                  <img src={formatImageUrl(item)} alt={product.productName} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>

          <Stack direction="column" spacing={4}>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Tên sản phẩm
              </Typography>
              <Typography variant="body1" width={200}>
                {product.productName}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Nguồn gốc xuất xứ
              </Typography>
              <Typography variant="body1" width={200}>
                {product.location}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Giá mong muốn
              </Typography>
              <Typography variant="body1" width={200}>
                {`${formatCurrency(product.expectedPrice)}/${product.sku}`}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Mô tả sản phẩm
              </Typography>
              <Typography variant="body1" width={200}>
                {product.description}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Cách bảo quản
              </Typography>
              <Typography variant="body1" width={200}>
                {product.preservation}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Loại sản phẩm
              </Typography>
              <Label color="success">{`${product.category.categoryName}`}</Label>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Hình ảnh chứng nhận sản phẩm
              </Typography>
              <ImageList sx={{ width: 500}} cols={3} rowHeight={164}>
                {product.certificateImages.map((item) => (
                  <ImageListItem key={item}>
                    <img src={formatImageUrl(item)} alt={product.productName} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Nhà cung cấp
              </Typography>
              <Label color="info">{`${product.supplier.name}`}</Label>
            </Stack>
          </Stack>
        </Stack>
      </Container>
      <Dialog open={open} onClose={handleClose} fullWidth="true">
        <DialogTitle>Đặt mua sản phẩm</DialogTitle>
        <Stack spacing={4} padding={4}>
          <DialogContentText>{`Đặt mua ${product.productName}`}</DialogContentText>
          <TextField name="amount" label="Số lượng" onChange={handleChange} />
          <TextField name="price" fullWidth label="Giá tiền" onChange={handleChange} />
          <TextField name="note" fullWidth multiline rows={5} label="Ghi chú" onChange={handleChange} />
          <Stack spacing={1}>
            <Typography>Ngày nhận hàng</Typography>
            <input type="date" name="harvestAt" style={dateStyle} label="Ngày nhận hàng" onChange={handleChange} />
          </Stack>
        </Stack>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" color="info" onClick={createNewPurchaseOrder}>
            Đặt mua
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
