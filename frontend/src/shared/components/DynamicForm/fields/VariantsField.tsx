import { findManyProductAttributes } from '@shared/utils/ProductAttributes';
import React, { useState, useEffect } from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface AttributeValue {
  id: number;
  value: string;
  slug: string;
  color_code?: string;
}

interface Attribute {
  id: number;
  name: string;
  slug: string;
  type: 'color' | 'select' | 'radio';
  active_values: AttributeValue[];
}

interface Variant {
  id?: number;
  name?: string;
  sku: string;
  price: number;
  original_price?: number;
  stock: number;
  discount_percentage?: number;
  thumbnail_id?: number;
  is_active: boolean;
  is_default: boolean;
  position?: number;
  attribute_values: number[]; // Array of attribute value IDs
  _combination?: string; // For display only
}

interface VariantsFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  productId?: number;
  productName?: string;
  productSku?: string;
  defaultPrice?: number;
  defaultOriginalPrice?: number;
}

export const VariantsField: React.FC<VariantsFieldProps> = ({
  name,
  control,
  label = 'Product Variants',
  productName = '',
  productSku = 'PROD',
  defaultPrice = 0,
  defaultOriginalPrice = 0,
}) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(false);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name,
  });

  // Fetch attributes từ API
  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const response = await findManyProductAttributes({ active_only: 1 });
      
      if(response && !response.error){
        const {data} = response;
        setAttributes(data || []);
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle attribute value selection
  const toggleAttributeValue = (attributeId: number, valueId: number) => {
    setSelectedAttributes((prev) => {
      const currentValues = prev[attributeId] || [];
      const newValues = currentValues.includes(valueId)
        ? currentValues.filter((id) => id !== valueId)
        : [...currentValues, valueId];

      return {
        ...prev,
        [attributeId]: newValues,
      };
    });
  };

  // Generate all variant combinations
  const generateVariants = () => {
    const selectedAttrEntries = Object.entries(selectedAttributes).filter(
      ([_, values]) => values.length > 0
    );

    if (selectedAttrEntries.length === 0) {
      alert('Please select at least one attribute value');
      return;
    }

    // Generate cartesian product of all selected attribute values
    const combinations = generateCombinations(selectedAttrEntries);

    // Create variants from combinations
    const newVariants: Variant[] = combinations.map((combo, index) => {
      const attributeValueIds = combo.map((item) => item.valueId);
      const combinationText = combo.map((item) => item.valueName).join(' / ');
      const skuSuffix = combo
        .map((item) => item.valueSlug.toUpperCase())
        .join('-');

      return {
        sku: `${productSku}-${skuSuffix}`,
        name: `${productName} - ${combinationText}`,
        price: defaultPrice,
        discounted_price: defaultPrice,
        original_price: defaultOriginalPrice,
        stock: 0,
        discount_percentage: defaultOriginalPrice > 0 
          ? Math.round(((defaultOriginalPrice - defaultPrice) / defaultOriginalPrice) * 100) 
          : 0,
        is_active: true,
        is_default: index === 0,
        position: index + 1,
        attribute_values: attributeValueIds,
        _combination: combinationText,
      };
    });

    // Replace all variants - FIX: Remove all fields at once using array indices
    const currentFieldsCount = fields.length;
    if (currentFieldsCount > 0) {
      // Create array of indices in reverse order to avoid index shifting issues
      const indicesToRemove = Array.from({ length: currentFieldsCount }, (_, i) => currentFieldsCount - 1 - i);
      indicesToRemove.forEach(index => remove(index));
    }
    
    // Add new variants
    newVariants.forEach((variant) => append(variant));
  };

  // Generate cartesian product of attribute values
  const generateCombinations = (
    selectedAttrEntries: [string, number[]][]
  ): Array<Array<{ valueId: number; valueName: string; valueSlug: string }>> => {
    const result: Array<
      Array<{ valueId: number; valueName: string; valueSlug: string }>
    > = [[]];

    for (const [attrIdStr, valueIds] of selectedAttrEntries) {
      const attrId = parseInt(attrIdStr);
      const attribute = attributes.find((a) => a.id === attrId);
      if (!attribute) continue;

      const tempResult: Array<
        Array<{ valueId: number; valueName: string; valueSlug: string }>
      > = [];

      for (const combo of result) {
        for (const valueId of valueIds) {
          const value = attribute.active_values.find((v) => v.id === valueId);
          if (value) {
            tempResult.push([
              ...combo,
              {
                valueId: value.id,
                valueName: value.value,
                valueSlug: value.slug,
              },
            ]);
          }
        }
      }

      result.length = 0;
      result.push(...tempResult);
    }

    return result;
  };

  // Set variant as default
  const setAsDefault = (index: number) => {
    fields.forEach((field, idx) => {
      update(idx, { ...field, is_default: idx === index });
    });
  };

  return (
    <Box sx={{ my: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add product variations like size, color to give buyers more choices
        </Typography>
      </Box>

      {/* Attribute Selection Section - Shopee Style */}
      <Paper variant="outlined" sx={{ mb: 3 }}>
        <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Phân loại biến thể
            </Typography>
            {fields.length > 0 && (
              <Chip
                label={`${fields.length} variation${fields.length !== 1 ? 's' : ''}`}
                size="small"
                color="primary"
                sx={{ fontSize: 12 }}
              />
            )}
          </Stack>
        </Box>

        <Box sx={{ p: 2.5 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={3}>
              {attributes.map((attribute) => (
                <Box key={attribute.id}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        minWidth: 100,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {attribute.name}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flex: 1 }}>
                      {attribute.active_values.map((value) => {
                        const isSelected = (
                          selectedAttributes[attribute.id] || []
                        ).includes(value.id);

                        return (
                          <Chip
                            key={value.id}
                            label={
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                {attribute.type === 'color' && value.color_code && (
                                  <Box
                                    sx={{
                                      width: 14,
                                      height: 14,
                                      borderRadius: '2px',
                                      bgcolor: value.color_code,
                                      border: '1px solid rgba(0,0,0,0.1)',
                                    }}
                                  />
                                )}
                                <span>{value.value}</span>
                              </Stack>
                            }
                            onClick={() => toggleAttributeValue(attribute.id, value.id)}
                            color={isSelected ? 'primary' : 'default'}
                            variant={isSelected ? 'filled' : 'outlined'}
                            size="medium"
                            sx={{
                              cursor: 'pointer',
                              fontWeight: isSelected ? 500 : 400,
                              '&:hover': {
                                borderColor: 'primary.main',
                              },
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Stack>
                  <Divider />
                </Box>
              ))}

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={generateVariants}
                sx={{
                  alignSelf: 'flex-start',
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Generate Variation List
              </Button>
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Variants Table Section - Shopee Style */}
      {fields.length > 0 && (
        <Paper variant="outlined">
          <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" fontWeight={600}>
                Variation List
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Apply to all:
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const bulkPrice = prompt('Enter price for all variants:');
                    if (bulkPrice) {
                      fields.forEach((field, idx) => {
                        update(idx, { ...field, price: parseFloat(bulkPrice) || 0 });
                      });
                    }
                  }}
                  sx={{ textTransform: 'none', fontSize: 12 }}
                >
                  Price
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const bulkStock = prompt('Enter stock for all variants:');
                    if (bulkStock) {
                      fields.forEach((field, idx) => {
                        update(idx, { ...field, stock: parseInt(bulkStock) || 0 });
                      });
                    }
                  }}
                  sx={{ textTransform: 'none', fontSize: 12 }}
                >
                  Stock
                </Button>
              </Stack>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                    Variation
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', width: 180 }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', width: 120 }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', width: 150 }}>
                    SKU
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', width: 100 }} align="center">
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', width: 80 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <Controller
                    key={field.id}
                    name={`${name}.${index}`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TableRow
                        hover
                        sx={{
                          bgcolor: value.is_default ? 'primary.50' : 'inherit',
                          '&:hover': { bgcolor: value.is_default ? 'primary.100' : 'action.hover' },
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {value.is_default && (
                              <Chip
                                label="Default"
                                size="small"
                                color="primary"
                                sx={{ height: 20, fontSize: 11 }}
                              />
                            )}
                            <Typography variant="body2" fontWeight={value.is_default ? 500 : 400}>
                              {value._combination || value.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={1}>
                            <TextField
                              size="small"
                              type="number"
                              value={value.price}
                              onChange={(e) =>
                                onChange({
                                  ...value,
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">₫</InputAdornment>
                                ),
                              }}
                              sx={{ '& input': { fontSize: 14 } }}
                            />
                            {value.original_price !== undefined && value.original_price > 0 && (
                              <TextField
                                size="small"
                                type="number"
                                value={value.original_price}
                                onChange={(e) =>
                                  onChange({
                                    ...value,
                                    original_price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                placeholder="Original price"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">₫</InputAdornment>
                                  ),
                                }}
                                sx={{ '& input': { fontSize: 13 } }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={value.stock}
                            onChange={(e) =>
                              onChange({
                                ...value,
                                stock: parseInt(e.target.value) || 0,
                              })
                            }
                            sx={{
                              '& input': { fontSize: 14 },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={value.sku}
                            onChange={(e) => onChange({ ...value, sku: e.target.value })}
                            placeholder="Auto-generated"
                            sx={{ '& input': { fontSize: 13 } }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={value.is_active}
                                onChange={(e) =>
                                  onChange({
                                    ...value,
                                    is_active: e.target.checked,
                                  })
                                }
                                size="small"
                              />
                            }
                            label=""
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            {!value.is_default && (
                              <Tooltip title="Set as default">
                                <IconButton
                                  size="small"
                                  onClick={() => setAsDefault(index)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => remove(index)}
                                sx={{ color: 'error.main' }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Footer */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Variations: <strong>{fields.length}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Stock:{' '}
                  <strong>
                    {fields.reduce((sum, field: any) => sum + (field.stock || 0), 0)}
                  </strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default VariantsField;


