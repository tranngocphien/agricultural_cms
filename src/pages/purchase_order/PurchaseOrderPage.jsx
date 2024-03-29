import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TextField,
  TableHead,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Select,
  Button,
  Dialog,
  ImageList,
  DialogContent,
  DialogContentText,
  ImageListItem,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import { formatCurrency } from '../../utils/formatNumber';
import { fDateTime, fDate  } from '../../utils/formatTime';
import { UserListToolbar } from '../../sections/@dashboard/user';
import axios from '../../data/httpCommon';
import { formatImageUrl } from '../../utils/formatUrl';


const dateStyle = {
  height: '3rem',
  fontSize: '18px',
  backgroundColor: 'info',
  border: '1px solid #d4d9d6',
  borderRadius: 4,
  padding: 16,
};

const TABLE_HEAD = [
  { id: 'id', label: 'Mã đơn hàng', alignRight: false },
  { id: 'productName', label: 'Tên sản phẩm', alignRight: false },
  { id: 'amount', label: 'Số lượng', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: 'harvestDay', label: 'Ngày nhận', alignRight: false },
  { id: 'price', label: 'Giá', alignRight: false },
  { id: 'detail', label: '', alignRight: false },
  { id: 'delete', label: '', alignRight: false },
];


export default function PurchaseOrderPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [page, setPage] = useState(0);

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [orders, setOrders] = useState([]);

  const [totalOrder, setTotalOrder] = useState(10);

  const [formData, setFormData] = useState({
    id: 0,
    price: 0,
    amount: 0,
    note: '',
    status: 'IDLE',
    harvestAt: new Date(),
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCloseDetail = (event) => {
    setOpenDetail(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDetailOrder = (event, order) => {
    setSelectedOrder(order);
    formData.id = order.id;
    formData.amount = order.amount;
    formData.price = order.price;
    formData.note = order.note;
    formData.status = order.status;
    formData.harvestAt = order.harvestAt;
    setOpenDetail(true);
  };

  const handleDelete = (event, order) => {
    setSelectedOrder(order);
    setOpenDelete(true);
  };

  useEffect(() => {
    axios.get(`/api/admin/purchaseOrders?page=${page}&size=${rowsPerPage}`).then((response) => {
      setOrders(response.data.data);
      setTotalOrder(response.data.paginationInfo.totalElement);
      console.log(response);
    });
  }, []);

  const updatePurchaseOrder = async () => {
    try {
      axios
        .post('/api/purchase-orders/update', formData)
        .then((response) => {
          console.log(response.data);
          setOpenDetail(false);
          reloadOrders();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } 
  };

  const reloadOrders = async () => {
    axios.get(`/api/admin/purchaseOrders?page=${page}&size=${rowsPerPage}`).then((response) => {
      setOrders(response.data.data);
      console.log(response);
    });
  }

  const deletePurchaseOrder = async () => {
    try {
      axios
        .delete(`/api/purchase-orders/delete/${selectedOrder.id}`)
        .then((response) => {
          console.log(response.data);
          setOpenDelete(false);
          reloadOrders();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } 
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    axios.get(`/api/admin/purchaseOrders?page=${newPage}&size=${rowsPerPage}`).then((response) => {
      setOrders(response.data.data);
      console.log(response);
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));

    axios.get(`/api/admin/purchaseOrders?page=${page}&size=${event.target.value}`).then((response) => {
      setOrders(response.data.data);
      console.log(response);
    });
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage) : 0;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Đơn mua hàng
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.alignRight ? 'right' : 'left'}
                      >
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((row) => {
                    const { id, username, shippingFee, amount, firstName, lastName } = row;
                    const statusColor = getStatusColor(row.status);
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell component="th" scope="row" padding="10">
                          {row.id}
                        </TableCell>
                        <TableCell align="left">{row.supplierProduct.productName}</TableCell>
                        <TableCell align="left">{row.amount}</TableCell>
                        <TableCell align="left">
                          <Label color={statusColor}>{row.status}</Label>
                        </TableCell>

                        <TableCell align="left">{fDateTime(row.harvestAt, 'dd/MM/yyyy')}</TableCell>
                        <TableCell align="left">{formatCurrency(row.price)}</TableCell>
                        <TableCell align="left" onClick={(event) => handleDetailOrder(event, row)}>
                          <Label color="info">Chi tiết</Label>
                        </TableCell>
                        <TableCell align="left" onClick={(event) => handleDelete(event, row)}>
                          <Label color="error">Xóa</Label>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {false && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrder}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Bạn có chắc chắn muốn xóa đơn hàng này không?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn không thể hoàn tác sau khi ấn xác nhận.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Hủy</Button>
          <Button onClick={deletePurchaseOrder} autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {orders.length > 0 && selectedOrder != null && (
        <Dialog open={openDetail} onClose={handleCloseDetail} fullWidth="true">
          <DialogTitle>Thông tin đơn mua hàng</DialogTitle>
          <Stack padding={2} spacing={2}>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Thông tin sản phẩm
              </Typography>
              <Stack direction={'column'} spacing={2}>
                <Typography variant="h6">{selectedOrder.supplierProduct.productName}</Typography>
                <ImageList sx={{ width: 300 }} cols={3} rowHeight={100}>
                  {selectedOrder.supplierProduct.images.map((item) => (
                    <ImageListItem key={item}>
                      <img src={formatImageUrl(item)} alt="" loading="lazy" />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Stack>
            </Stack>
            <TextField name="amount" label="Số lượng" onChange={handleChange} value={formData.amount} />
            <TextField name="price" fullWidth label="Giá tiền" onChange={handleChange} value={formData.price}  />
            <TextField name="note" fullWidth multiline rows={5} label="Ghi chú" onChange={handleChange} value={formData.note}  />
            <Stack spacing={1}>
              <Typography>Ngày nhận hàng</Typography>
              <input type="date" name="harvestAt" style={dateStyle} label="Ngày nhận hàng" onChange={handleChange} value={fDate(formData.harvestAt, "yyyy-MM-dd")} />
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Trạng thái
              </Typography>
              <Select width={200} name="status" value={formData.status} onChange={handleChange}>
                <MenuItem value={'IDLE'}>IDLE</MenuItem>
                <MenuItem value={'PROCESS'}>PROCESS</MenuItem>
                <MenuItem value={'DONE'}>DONE</MenuItem>
                <MenuItem value={'REJECT'}>REJECT</MenuItem>
              </Select>
            </Stack>
          </Stack>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleCloseDetail}>
              Hủy
            </Button>
            <Button variant="contained" color="info" onClick={updatePurchaseOrder}>
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'IDLE':
      return 'info';
    case 'PROCESS':
      return 'secondary';
    case 'DONE':
      return 'success';
    case 'REJECT':
      return 'error';
    default:
      return 'default';
  }
}
