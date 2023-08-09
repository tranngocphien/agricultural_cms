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
  CircularProgress,
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
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
  const [certificateImages, setCertificateImages] = useState(product.certificateImages);

  const [newImages, setNewImages] = useState([]);
  const [newCertificateImages, setNewCertificateImages] = useState([]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const updateProduct = async (event) => {
    setLoading(true);
    if (newImages.length > 0) {
      await uploadImageProduct();
    } else {
      formData.images = images;
    }
    if (newCertificateImages.length > 0) {
      await uploadCertificateImages();
    } else {
      formData.certificateImages = certificateImages;
    }
    axios
      .post('/api/products/update', formData)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const uploadCertificateImages = async () => {
    try {
      const imageFormData = new FormData();
      for (let i = 0; i < newCertificateImages.length; i += 1) {
        imageFormData.append('files', newCertificateImages[i]);
      }
      const response = await axios.post('/api/images/upload', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      formData.certificateImages = certificateImages.concat(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImageProduct = async () => {
    try {
      const imageFormData = new FormData();
      for (let i = 0; i < newImages.length; i += 1) {
        imageFormData.append('files', newImages[i]);
      }
      const response = await axios.post('/api/images/upload', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      formData.images = images.concat(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = (event) => {
    axios
      .post(`/api/products/delete/${product.id}`, formData)
      .then((response) => {
        console.log(response.data);
        navigate(-1);
      })
      .catch((error) => {
        alert('Không thể xóa sản phẩm này');
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
      selectedImages.push(event.target.files[i]);
    }

    setNewImages(selectedImages);
    console.log(event.target.files);
  };

  const handleUploadCertificateImage = (event) => {
    const selectedImages = [];

    for (let i = 0; i < event.target.files.length; i += 1) {
      selectedImages.push(event.target.files[i]);
    }

    setNewCertificateImages(selectedImages);
    console.log(event.target.files);
  };

  const deleteImageByIndex = (index) => {
    setImages((images) => {
      return images.filter((_, i) => i !== index);
    });
  };

  const deleteCertificateImageByIndex = (index) => {
    setCertificateImages((certificateImages) => {
      return certificateImages.filter((_, i) => i !== index);
    });
  };

  const deleteNewImageByIndex = (index) => {
    setNewImages((newImages) => {
      return newImages.filter((_, i) => i !== index);
    });
  };

  const deleteNewCertificateImageByIndex = (index) => {
    setNewCertificateImages((newCertificateImages) => {
      return newCertificateImages.filter((_, i) => i !== index);
    });
  };

  return (
    <div>
      <Stack spacing={2}>
        { loading && <Stack direction="row" alignItems="center" alignContent="center" justifyContent="center">
          <CircularProgress />
        </Stack>}
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
              <Box sx={{ height: 10 }} />
              <ImageList sx={{ width: 450, height: 450 }} cols={2} rowHeight={164}>
                {images.map((item, index) => (
                  <ImageListItem>
                    <div>
                      <Button style={{ zIndex: '3' }} onClick={() => deleteImageByIndex(index)}>
                        Xóa
                      </Button>
                      <img src={formatImageUrl(item)} alt="" style={{ width: 150, height: 100 }} />
                    </div>
                  </ImageListItem>
                ))}

                {newImages.map((item, index) => (
                  <ImageListItem>
                    <div>
                      <Button style={{ zIndex: '3' }} onClick={() => deleteNewImageByIndex(index)}>
                        Xóa
                      </Button>
                      <img src={URL.createObjectURL(item)} alt="" style={{ width: 150, height: 100, zIndex: '1' }} />
                    </div>
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
            <Box sx={{ width: 1000, height: 500, border: '1px dashed grey', borderRadius: 4, padding: 2 }}>
              <input accept="image/" type="file" multiple onChange={handleUploadCertificateImage} />
              {certificateImages.map((item, index) => (
                <ImageListItem>
                  <div>
                    <Button onClick={() => deleteCertificateImageByIndex(index)}>Xóa</Button>
                    <img src={formatImageUrl(item)} alt="" style={{ width: 150, height: 100 }} />
                  </div>
                </ImageListItem>
              ))}
              {newCertificateImages.map((item, index) => (
                <ImageListItem>
                  <div>
                    <Button style={{ zIndex: '3' }} onClick={() => deleteNewCertificateImageByIndex(index)}>
                      Xóa
                    </Button>
                    <img src={URL.createObjectURL(item)} alt="" style={{ width: 150, height: 100, zIndex: '1' }} />
                  </div>
                </ImageListItem>
              ))}
            </Box>
          </Stack>
          <Button
            variant="contained"
            onClick={async () => {
              await updateProduct();
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
        <DialogTitle id="alert-dialog-title">{'Bạn có chắc chắn muốn xóa sản phẩm này không?'}</DialogTitle>
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
