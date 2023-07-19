import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  DialogContentText,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogActions,
  TablePagination,
} from '@mui/material';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import axios from '../../data/httpCommon';
import { formatImageUrl } from '../../utils/formatUrl';

const TABLE_HEAD = [
  { id: 'id', label: 'ID nhà cung cấp', alignRight: false },
  { id: 'name', label: 'Tên nhà cung cấp', alignRight: false },
  { id: 'location', label: 'Địa chỉ', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'bandImage', label: 'Hình ảnh', alignRight: false },
  { id: 'function', label: '', alignRight: false },
];

export default function SupplierPage() {
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadImageURL, setUploadImageURL] = useState('');

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [suppliers, setSuppliers] = useState([]);

  const handleUploadImage = (event) => {
    setUploadImage(event.target.files[0]);
  };

  const handleClose = (event) => {
    setOpen(false);
  };

  const handleCloseCreate = (event) => {
    setOpenCreate(false);
  };

  const handleOpenUpdate = (event, supplier) => {
    setSelectedSupplier(supplier);
    formData.id = supplier.id;
    formData.name = supplier.name;
    formData.location = supplier.location;
    formData.description = supplier.description;
    formData.brandImage = supplier.brandImage;
    setOpen(true);
  };

  const handleOpenCreate = () => {
    supplierData.name = '';
    supplierData.location = '';
    supplierData.description = '';
    supplierData.brandImage = '';
    setOpenCreate(true);
  };

  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    location: '',
    description: '',
    brandImage: '',
  });

  const [supplierData, setSupplierData] = useState({
    name: '',
    location: '',
    description: '',
    brandImage: '',
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleChangeCreate = (event) => {
    setSupplierData({ ...supplierData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    axios.get(`/api/suppliers`).then((response) => {
      setSuppliers(response.data.data);
      console.log(response);
    });
  }, []);

  const uploadBrandImage = async () => {
    try {
      const imageFormData = new FormData();
      imageFormData.append('files', uploadImage);

      const response = await axios.post('/api/images/upload', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      setUploadImageURL(response.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewSupplier = async () => {
    try {
      const imageFormData = new FormData();
      imageFormData.append('files', uploadImage);

      const response = await axios.post('/api/images/upload', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      supplierData.brandImage = response.data.data[0];
      axios
        .post('/api/suppliers/register', supplierData)
        .then((response) => {
          console.log(response.data);
          reloadSuppliers();
          handleCloseCreate();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateSupplier = async () => {
    try {
      if (uploadImage != null) {
        const imageFormData = new FormData();
        imageFormData.append('files', uploadImage);

        const response = await axios.post('/api/images/upload', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        formData.brandImage = response.data.data[0];
      }

      axios
        .post('/api/suppliers/update', formData)
        .then((response) => {
          console.log(response.data);
          reloadSuppliers();
          handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const reloadSuppliers = async () => {
    axios.get(`/api/suppliers`).then((response) => {
      setSuppliers(response.data.data);
      console.log(response);
    });
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Nhà cung cấp
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              handleOpenCreate();
            }}
          >
            Tạo nhà cung cấp mới
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={suppliers.length} />
                <TableBody>
                  {suppliers.map((row) => {
                    const { id, name, location, description, brandImage, lastName } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell component="th" scope="row">
                          {id}
                        </TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{location}</TableCell>

                        <TableCell align="left">{description}</TableCell>

                        <TableCell align="left">
                          <img src={formatImageUrl(brandImage)} alt="" loading="lazy" width={50} height={50} />
                        </TableCell>

                        <TableCell align="left">
                          <Stack spacing={1}>
                            {/* <Label color="error">Xóa</Label> */}
                            <Label color="info" onClick={(event) => handleOpenUpdate(event, row)}>
                              Cập nhật
                            </Label>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>

      <Dialog open={openCreate} onClose={handleCloseCreate} fullWidth="true">
        <DialogTitle>Tạo mới nhà cung cấp</DialogTitle>
        <Stack padding={2} spacing={2}>
          <Stack spacing={4} padding={4}>
            <TextField name="name" label="Tên" onChange={handleChangeCreate} />
            <TextField name="location" fullWidth label="Địa chỉ" onChange={handleChangeCreate} />
            <TextField name="description" fullWidth multiline rows={5} label="Mô tả" onChange={handleChangeCreate} />
            <Typography>Hình ảnh</Typography>
            <input accept="image/" type="file" multiple onChange={handleUploadImage} />
            {uploadImage != null && <img src={URL.createObjectURL(uploadImage)} alt="" width="100" height="100" />}
          </Stack>
        </Stack>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" color="info" onClick={createNewSupplier}>
            Tạo mới
          </Button>
        </DialogActions>
      </Dialog>
      {suppliers.length > 0 && selectedSupplier != null && (
        <Dialog open={open} onClose={handleClose} fullWidth="true">
          <DialogTitle>Thông tin nhà cung cấp</DialogTitle>
          <Stack padding={2} spacing={2}>
            <Stack spacing={4} padding={4}>
              <TextField name="name" label="Tên" onChange={handleChange} value={formData.name} />
              <TextField name="location" fullWidth label="Địa chỉ" onChange={handleChange} value={formData.location} />
              <TextField
                name="description"
                fullWidth
                multiline
                rows={5}
                label="Mô tả"
                onChange={handleChange}
                value={formData.description}
              />
              <Typography>Hình ảnh</Typography>
              <input accept="image/" type="file" multiple onChange={handleUploadImage} />
              {uploadImage != null && <img src={URL.createObjectURL(uploadImage)} alt="" width="100" height="100" />}
              {uploadImage == null && <img src={formatImageUrl(formData.brandImage)} alt="" loading="lazy" width={100} height={100} />}
            </Stack>
          </Stack>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="contained" color="info" onClick={updateSupplier}>
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
