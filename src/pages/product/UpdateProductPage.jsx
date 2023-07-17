import {
  ImageList,
  ImageListItem,
  FormControl,
  InputLabel,
  Box,
  TextField,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatImageUrl } from '../../utils/formatUrl';
import axios from '../../data/httpCommon';

export default function UpdateProductPage() {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [certificateImages, setCertificateImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const product = location.state.product;
  console.log(product);

  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    price: product.price,
    sku: product.sku,
    stock: product.stock,
    categoryID: product.category.id,
    supplierId: product.supplier.id,
    location: product.origin,
    preservation: product.preservation,
    description: product.description,
    images: product.images,
    certificateImages: product.certificateImages,
  });
  const [images, setImages] = useState(product.images);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const updateProduct = (event) => {
    axios
      .post('/api/products/update', formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteProduct = (event) => {
    axios
      .post(`/api/products/delete/${product.id}`, formData)
      .then((response) => {
        console.log(response.data);
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios.get('/api/category').then((response) => {
      setCategories(response.data.data);
    });

    axios.get('/api/suppliers').then((response) => {
      setSuppliers(response.data.data);
    });
  }, []);

  const handleUploadImage = (event) => {
    const selectedImages = [];

    for (let i = 0; i < event.target.files.length; i += 1) {
      selectedImages.push(URL.createObjectURL(event.target.files[i]));
    }

    setImages(selectedImages);
    console.log(event.target.files);
  };

  return (
    <div>
          <Stack spacing={2}>
      <Stack direction="row" justifyContent={'space-between'}>
        <Typography variant="h4" gutterBottom>
          Thông tin sản phẩm
        </Typography>
        <Button variant="contained" color="error" onClick={handleClickOpen}>
          Xóa sản phẩm
        </Button>
      </Stack>
      <Stack spacing={2}>
        <TextField name="name" label="Tên sản phẩm" onChange={handleChange} value={formData.name} />
        <Stack direction="row" spacing={2}>
          <TextField name="price" fullWidth label="Giá sản phẩm" onChange={handleChange} value={formData.price} />
          <TextField name="sku" fullWidth label="Đơn vị" onChange={handleChange} value={formData.sku} />
          <TextField name="stock" fullWidth label="Số lượng" onChange={handleChange} value={formData.stock} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Thể loại</InputLabel>
            <Select
              id="category"
              name="categoryID"
              fullWidth
              label="Thể loại"
              onChange={handleChange}
              value={formData.categoryID}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Nhà cung cấp</InputLabel>
            <Select
              id="supplier"
              name="supplierId"
              fullWidth
              label="Nhà cung cấp"
              onChange={handleChange}
              value={formData.supplierId}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <TextField name="location" label="Địa điểm" onChange={handleChange} value={formData.location} />
        <TextField
          name="preservation"
          fullWidth
          multiline
          rows={3}
          label="Cách bảo quản"
          onChange={handleChange}
          value={formData.preservation}
        />
        <TextField
          name="description"
          fullWidth
          multiline
          rows={5}
          label="Mô tả"
          onChange={handleChange}
          value={formData.description}
        />
        <Stack direction="row" spacing={2} justifyContent={'space-between'}>
          <Box sx={{ width: 1000, height: 500, border: '1px dashed grey', borderRadius: 4, padding: 2 }}>
            <input accept="image/" type="file" onChange={handleUploadImage} multiple />
            <ImageList sx={{ width: 450, height: 450 }} cols={2} rowHeight={164}>
              {images.map((item) => (
                <ImageListItem>
                  <img src={formatImageUrl(item)} alt="" />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
          <Box sx={{ width: 1000, height: 500, border: '1px dashed grey', borderRadius: 4, padding: 2 }}>
            <input accept="image/" type="file" multiple />
            {certificateImages.map((item) => (
              <ImageListItem>
                <img src={formatImageUrl(item)} alt="" />
              </ImageListItem>
            ))}
          </Box>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            updateProduct();
            navigate(-1);
          }}
        >
          Cập nhật
        </Button>
      </Stack>
    </Stack>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn có chắc chắn muốn xóa sản phẩm này không?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn không thể hoàn tác sau khi ấn xác nhận.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={deleteProduct} autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

    </div>

  );
}
