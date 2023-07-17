import { styled } from '@mui/material/styles';
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../data/httpCommon';

export default function CreateProductPage() {
  const [images, setImages] = useState([]);
  const [certificateImages, setCertificateImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    sku: '',
    stock: 0,
    categoryID: 0,
    supplierId: 0,
    location: '',
    preservation: '',
    description: '',
    images: [],
    certificateImages: [],
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const createNewProduct = async (event) => {
    const imageFormData = new FormData();
    for (let i = 0; i < images.length; i += 1) {
      imageFormData.append('files', images[i]);
    }
    await uploadCertificateImages();
    axios
      .post('/api/images/upload', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        formData.images = response.data.data;
        axios
        .post('/api/products/create', formData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      });
  };

  const uploadCertificateImages = async () => {
    try {
      const imageFormData = new FormData();
      for (let i = 0; i < certificateImages.length; i += 1) {
        imageFormData.append('files', certificateImages[i]);
      }
      const response = await axios
      .post('/api/images/upload', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      formData.certificateImages = response.data.data;

    } catch (error) {
      console.log(error);
    }
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

    setImages(selectedImages);
    console.log(event.target.files);
  };

  const handleUploadCertificateImage = (event) => {
    const selectedImages = [];

    for (let i = 0; i < event.target.files.length; i += 1) {
      selectedImages.push(event.target.files[i]);
    }

    setCertificateImages(selectedImages);
    console.log(event.target.files);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" gutterBottom>
        Tạo sản phẩm mới
      </Typography>
      <Stack spacing={2}>
        <TextField name="name" label="Tên sản phẩm" onChange={handleChange} />
        <Stack direction="row" spacing={2}>
          <TextField name="price" fullWidth label="Giá sản phẩm" onChange={handleChange} />
          <TextField name="sku" fullWidth label="Đơn vị" onChange={handleChange} />
          <TextField name="stock" fullWidth label="Số lượng" onChange={handleChange} />
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
        <TextField name="location" label="Địa điểm" onChange={handleChange} />
        <TextField name="preservation" fullWidth multiline rows={3} label="Cách bảo quản" onChange={handleChange} />
        <TextField name="description" fullWidth multiline rows={5} label="Mô tả" onChange={handleChange} />
        <Stack direction="row" spacing={2} justifyContent={'space-between'}>
          <Box sx={{ width: 1000, height: 500, border: '1px dashed grey', borderRadius: 4, padding: 2 }}>
            <input accept="image/" type="file" onChange={handleUploadImage} multiple />
            <ImageList sx={{ width: 450, height: 450 }} cols={2} rowHeight={164}>
              {images.map((item) => (
                <ImageListItem>
                  <img src={URL.createObjectURL(item)} alt=""  style={{width: 200, height: 200}} />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
          <Box sx={{ width: 1000, height: 500, border: '1px dashed grey', borderRadius: 4, padding: 2 }}>
            <input accept="image/" type="file" multiple onChange={handleUploadCertificateImage} />
            <ImageList sx={{ width: 450, height: 450 }} cols={2} rowHeight={164} gap={8}>
              {certificateImages.map((item) => (
                <ImageListItem key={item}>
                  <img src={URL.createObjectURL(item)} alt="" width="100" height="100" />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            createNewProduct();
            navigate(-1, {
              replace: true
            });
          }}
        >
          Tạo sản phẩm
        </Button>
      </Stack>
    </Stack>
  );
}
