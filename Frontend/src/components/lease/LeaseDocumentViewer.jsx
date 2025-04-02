import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import leaseService from '../../services/leaseService';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Description as DocumentIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';

const LeaseDocumentViewer = () => {
  const { leaseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [documents, setDocuments] = useState([]);
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [documentType, setDocumentType] = useState('LEASE_AGREEMENT');
  const [uploading, setUploading] = useState(false);

  const isLandlord = user?.role === 'LANDLORD';
  const isAdmin = user?.role === 'ADMIN';
  const isTenant = user?.role === 'TENANT';

  useEffect(() => {
    fetchLeaseDocuments();
  }, [leaseId]);

  const fetchLeaseDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get lease details
      let leaseData;
      if (isLandlord || isAdmin) {
        leaseData = await leaseService.getLeaseById(leaseId);
      } else if (isTenant) {
        leaseData = await leaseService.getTenantLease();
      }
      
      if (leaseData) {
        setLease(leaseData);
      } else {
        setError('Lease not found or you do not have access to view it.');
      }
      
      // Get lease documents
      const documentsData = await leaseService.getLeaseDocuments(leaseId || leaseData?.id);
      if (documentsData) {
        setDocuments(documentsData);
      }
    } catch (err) {
      console.error('Error fetching lease documents:', err);
      setError('Failed to load lease documents. Please try again later.');
      
      // Sample data for development if API calls fail
      setLease({
        id: leaseId || 1,
        property: {
          id: 1,
          name: 'Sunset Apartments',
          address: '123 Main Street, Apt 4B'
        },
        tenant: {
          id: 2,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        monthlyRent: 1200.00,
        securityDeposit: 2400.00,
        status: 'ACTIVE'
      });
      
      setDocuments([
        {
          id: 1,
          fileName: 'lease_agreement.pdf',
          documentType: 'LEASE_AGREEMENT',
          uploadDate: '2023-01-01T10:30:00Z',
          fileSize: 1024000,
          fileUrl: 'https://example.com/documents/lease_agreement.pdf'
        },
        {
          id: 2,
          fileName: 'addendum_1.pdf',
          documentType: 'ADDENDUM',
          uploadDate: '2023-02-15T14:45:00Z',
          fileSize: 512000,
          fileUrl: 'https://example.com/documents/addendum_1.pdf'
        },
        {
          id: 3,
          fileName: 'move_in_inspection.jpg',
          documentType: 'INSPECTION_REPORT',
          uploadDate: '2023-01-02T09:15:00Z',
          fileSize: 2048000,
          fileUrl: 'https://example.com/documents/move_in_inspection.jpg'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeLabel = (type) => {
    const types = {
      'LEASE_AGREEMENT': 'Lease Agreement',
      'ADDENDUM': 'Addendum',
      'INSPECTION_REPORT': 'Inspection Report',
      'NOTICE': 'Notice',
      'RECEIPT': 'Receipt',
      'OTHER': 'Other Document'
    };
    
    return types[type] || type;
  };

  const getDocumentIcon = (fileName) => {
    if (!fileName) return <FileIcon />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) {
      return <PdfIcon color="error" />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <ImageIcon color="primary" />;
    } else {
      return <FileIcon color="action" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const handleDownloadDocument = (document) => {
    // This would typically redirect to the document URL or trigger a download
    window.open(document.fileUrl, '_blank');
  };

  const handleDeleteDialogOpen = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      // This would call an API to delete the document
      // await leaseService.deleteLeaseDocument(lease.id, documentToDelete.id);
      
      // Update local state
      const updatedDocuments = documents.filter(doc => doc.id !== documentToDelete.id);
      setDocuments(updatedDocuments);
      
      // Close dialog
      handleDeleteDialogClose();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again later.');
    }
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
    setUploadFile(null);
    setDocumentType('LEASE_AGREEMENT');
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setUploadFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleUploadDocument = async () => {
    if (!uploadFile || !documentType) return;
    
    try {
      setUploading(true);
      
      // This would call an API to upload the document
      await leaseService.uploadLeaseDocument(lease.id, uploadFile, documentType);
      
      // Refresh document list
      fetchLeaseDocuments();
      
      // Close dialog
      handleUploadDialogClose();
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !lease) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(isLandlord ? `/landlord/leases/${lease.id}` : '/tenant/lease-details')}
        >
          Back to Lease Details
        </Button>
        
        {isLandlord && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<UploadIcon />}
            onClick={handleUploadDialogOpen}
          >
            Upload Document
          </Button>
        )}
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          <DocumentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Lease Documents
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Lease Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Property:</strong> {lease?.property?.name || lease?.property?.address}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tenant:</strong> {`${lease?.tenant?.firstName} ${lease?.tenant?.lastName}`}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Lease Period:</strong> {lease?.startDate} to {lease?.endDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {lease?.status}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {documents.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getDocumentIcon(document.fileName)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {document.fileName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getDocumentTypeLabel(document.documentType)}</TableCell>
                    <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleViewDocument(document)}
                        title="View"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleDownloadDocument(document)}
                        title="Download"
                      >
                        <DownloadIcon />
                      </IconButton>
                      {isLandlord && (
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteDialogOpen(document)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No documents available for this lease.
            </Typography>
            {isLandlord && (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<UploadIcon />}
                onClick={handleUploadDialogOpen}
                sx={{ mt: 2 }}
              >
                Upload Document
              </Button>
            )}
          </Box>
        )}
      </Paper>
      
      {/* View Document Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedDocument?.fileName}
          <IconButton
            onClick={() => window.open(selectedDocument?.fileUrl, '_blank')}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            title="Download"
          >
            <DownloadIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {selectedDocument?.fileUrl && (
              selectedDocument.fileName.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`${selectedDocument.fileUrl}#toolbar=0`}
                  width="100%"
                  height="100%"
                  title={selectedDocument.fileName}
                  style={{ border: 'none' }}
                />
              ) : selectedDocument.fileName.toLowerCase().match(/\.(jpe?g|png|gif)$/) ? (
                <img
                  src={selectedDocument.fileUrl}
                  alt={selectedDocument.fileName}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Typography variant="body1">
                  This file type cannot be previewed. Please download to view.
                </Typography>
              )
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownloadDocument(selectedDocument)}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Document Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the document "{documentToDelete?.fileName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteDocument} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Upload Document Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Upload a document to associate with this lease. Supported file types: PDF, JPG, PNG, DOC, DOCX.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="document-type-label">Document Type</InputLabel>
            <Select
              labelId="document-type-label"
              value={documentType}
              onChange={handleDocumentTypeChange}
              label="Document Type"
            >
              <MenuItem value="LEASE_AGREEMENT">Lease Agreement</MenuItem>
              <MenuItem value="ADDENDUM">Addendum</MenuItem>
              <MenuItem value="INSPECTION_REPORT">Inspection Report</MenuItem>
              <MenuItem value="NOTICE">Notice</MenuItem>
              <MenuItem value="RECEIPT">Receipt</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            fullWidth
          >
            Choose File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </Button>
          
          {uploadFile && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected file: {uploadFile.name} ({formatFileSize(uploadFile.size)})
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button 
            onClick={handleUploadDocument} 
            variant="contained" 
            disabled={!uploadFile || uploading}
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeaseDocumentViewer; 