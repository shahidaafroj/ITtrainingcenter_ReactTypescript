import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  TextField,
  Button,
  CircularProgress,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IVisitor } from '../../interfaces/IVisitor';
import { format } from 'date-fns';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { VisitorService } from '../../utilities/services/visitorService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  container: {
    maxHeight: 440,
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    gap: theme.spacing(2),
  },
  searchField: {
    flexGrow: 1,
  },
}));

const columns = [
  { id: 'visitorName', label: 'Visitor Name', minWidth: 170 },
  { id: 'contactNo', label: 'Contact No', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'visitDateTime', label: 'Visit Date', minWidth: 100 },
  { id: 'visitPurpose', label: 'Purpose', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' as const },
];

export const VisitorList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [visitors, setVisitors] = useState<IVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch visitors data
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await VisitorService.getAlll(true);
      setVisitors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load visitors');
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this visitor?')) {
      try {
        await VisitorService.delete(id);
        // Refresh the list after deletion
        await fetchVisitors();
      } catch (err) {
        console.error('Error deleting visitor:', err);
        alert('Cannot delete visitor because it has related records.');
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredData = useMemo(() => {
    return visitors.filter(visitor => 
      !search ||
      visitor.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      visitor.contactNo.includes(search) ||
      (visitor.email && visitor.email.toLowerCase().includes(search.toLowerCase()))
    );
  }, [visitors, search]);

  if (error) {
    return (
      <Container className={classes.root}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchVisitors}>Retry</Button>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <div className={classes.searchContainer}>
        <Typography variant="h4">Visitors</Typography>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={classes.searchField}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/visitors/add')}
        >
          Add Visitor
        </Button>
      </div>

      <Paper>
        <TableContainer className={classes.container}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    className={classes.tableHeader}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No visitors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((visitor) => (
                    <TableRow hover key={visitor.visitorId}>
                      <TableCell>{visitor.visitorName}</TableCell>
                      <TableCell>{visitor.contactNo}</TableCell>
                      <TableCell>{visitor.email}</TableCell>
                      <TableCell>
                        {format(new Date(visitor.visitDateTime), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{visitor.visitPurpose}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => navigate(`/visitors/details/${visitor.visitorId}`)}
                            className={classes.actionButton}
                          >
                            <VisibilityIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => navigate(`/visitors/edit/${visitor.visitorId}`)}
                            className={classes.actionButton}
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(visitor.visitorId)}
                            className={classes.actionButton}
                          >
                            <DeleteIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};