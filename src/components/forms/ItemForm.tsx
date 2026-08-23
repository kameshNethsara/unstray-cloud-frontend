import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import { PlusCircle, Search, Save } from 'lucide-react';
import dayjs from 'dayjs';
import { ITEM_CATEGORIES, type ItemType } from '../../types/item';
import MediaUploader from './MediaUploader';

const { TextArea } = Input;

/**
 * ───────────────────────────────────────────────────────────
 * DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper
const claimRed = "#A23E2E";  // LOST tag accent
const claimGreen = "#3E6C52"; // FOUND tag accent
// const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

// Schema Validation using Zod
const itemFormSchema = z.object({
  type: z.enum(['LOST', 'FOUND'], {
    message: 'Please select if the item is Lost or Found',
  }),
  title: z.string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description cannot exceed 1000 characters'),
  location: z.string().min(1, 'Location is required'),
  date: z.any().refine((val) => val !== null && val !== undefined, {
    message: 'Date is required',
  }),
  media: z.array(z.string()),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  initialValues?: Partial<ItemFormData & { dateString?: string }>;
  onSubmit: (data: ItemFormData & { formattedDate: string }) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  fixedType?: ItemType;
}

const ItemForm: React.FC<ItemFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'File Registry Entry',
  fixedType,
}) => {
  // Transform initial values (e.g. date conversion for Dayjs)
  const defaultValues: ItemFormData = {
    type: fixedType || initialValues?.type || 'LOST',
    title: initialValues?.title || '',
    category: initialValues?.category || '',
    description: initialValues?.description || '',
    location: initialValues?.location || '',
    date: initialValues?.date 
      ? dayjs(initialValues.date) 
      : initialValues?.dateString 
        ? dayjs(initialValues.dateString) 
        : dayjs(),
    media: initialValues?.media || [],
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues,
  });

  const onFormSubmit = (data: ItemFormData) => {
    const formattedDate = dayjs(data.date).toISOString();
    onSubmit({
      ...data,
      formattedDate,
    });
  };

  // Watch type for dynamic styling
  const currentType = watch('type');
  const typeAccentColor = currentType === 'LOST' ? claimRed : claimGreen;

  return (
    <Form layout="vertical" onFinish={handleSubmit(onFormSubmit)} style={{ fontFamily: bodyFont }}>
      
      {/* SECTION HEADER */}
      <div 
        style={{ 
          fontFamily: monoFont, 
          fontSize: '12px', 
          fontWeight: 700, 
          letterSpacing: '1px', 
          color: inkSoft, 
          textTransform: 'uppercase',
          marginBottom: '20px',
          borderBottom: `2px dashed ${paperDeep}`,
          paddingBottom: '8px'
        }}
      >
        Record Attributes // Fields Marked * Required
      </div>

      <Row gutter={32}>
        
        {/* LEFT COLUMN: BASIC METADATA */}
        <Col xs={24} lg={14}>
          
          {/* TYPE FIELD (CUSTOM STAMPED RADIO BUTTONS) */}
          {!fixedType && (
            <Form.Item
              label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 700 }}>Claim Type Classification *</span>}
              validateStatus={errors.type ? 'error' : ''}
              help={errors.type?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.type.message}</span> : null}
              required
              style={{ marginBottom: '24px' }}
            >
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      type="button"
                      onClick={() => field.onChange('LOST')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        fontFamily: monoFont,
                        fontWeight: 700,
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        border: `2px solid ${field.value === 'LOST' ? claimRed : inkSoft}`,
                        backgroundColor: field.value === 'LOST' ? claimRed : 'transparent',
                        color: field.value === 'LOST' ? paperLight : inkSoft,
                        boxShadow: field.value === 'LOST' ? `3px 3px 0px ${ink}` : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Search size={16} /> LOST ITEM
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange('FOUND')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        fontFamily: monoFont,
                        fontWeight: 700,
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        border: `2px solid ${field.value === 'FOUND' ? claimGreen : inkSoft}`,
                        backgroundColor: field.value === 'FOUND' ? claimGreen : 'transparent',
                        color: field.value === 'FOUND' ? paperLight : inkSoft,
                        boxShadow: field.value === 'FOUND' ? `3px 3px 0px ${ink}` : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <PlusCircle size={16} /> FOUND ITEM
                    </button>
                  </div>
                )}
              />
            </Form.Item>
          )}

          {/* TITLE FIELD */}
          <Form.Item
            label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 700 }}>Item Title / Designation *</span>}
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.title.message}</span> : null}
            required
            style={{ marginBottom: '20px' }}
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  placeholder="e.g. iPhone 15 Pro, Black Trifold Wallet" 
                  maxLength={100} 
                  style={{
                    fontFamily: displayFont,
                    fontSize: '18px',
                    fontWeight: 700,
                    color: ink,
                    borderRadius: 0,
                    border: `1px solid ${ink}`,
                    height: '48px',
                    backgroundColor: paper
                  }} 
                />
              )}
            />
          </Form.Item>

          {/* CATEGORY & DATE */}
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 700 }}>Category *</span>}
                validateStatus={errors.category ? 'error' : ''}
                help={errors.category?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.category.message}</span> : null}
                required
                style={{ marginBottom: '20px' }}
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      {...field} 
                      placeholder="Select category" 
                      style={{ 
                        fontFamily: monoFont, 
                        borderRadius: 0, 
                        width: '100%',
                        height: '42px'
                      }} 
                      size="large"
                    >
                      {ITEM_CATEGORIES.map((cat) => (
                        <Select.Option key={cat} value={cat}>
                          {cat}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 700 }}>Date Logged *</span>}
                validateStatus={errors.date ? 'error' : ''}
                help={errors.date?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.date.message as string}</span> : null}
                required
                style={{ marginBottom: '20px' }}
              >
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker 
                      {...field} 
                      style={{ 
                        width: '100%',
                        fontFamily: monoFont,
                        borderRadius: 0,
                        border: `1px solid ${ink}`,
                        height: '42px',
                        backgroundColor: paper
                      }} 
                      maxDate={dayjs()} 
                      format="YYYY-MM-DD"
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* LOCATION FIELD */}
          <Form.Item
            label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 700 }}>Location Sector *</span>}
            validateStatus={errors.location ? 'error' : ''}
            help={errors.location?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.location.message}</span> : null}
            required
            style={{ marginBottom: '20px' }}
          >
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  placeholder="e.g. Science Library, 2nd floor study area" 
                  style={{
                    fontFamily: bodyFont,
                    fontSize: '14px',
                    borderRadius: 0,
                    border: `1px solid ${ink}`,
                    height: '42px',
                    backgroundColor: paper
                  }} 
                />
              )}
            />
          </Form.Item>

          {/* DESCRIPTION FIELD */}
          <Form.Item
            label={<span style={{ fontFamily: monoFont, fontSize: '11px', textTransform: 'uppercase', color: inkSoft, fontWeight: 700 }}>Detailed Identification Marks *</span>}
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.description.message}</span> : null}
            required
            style={{ marginBottom: '20px' }}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder="Provide distinct characteristics (colors, stickers, brand, case, or contents of the bag/wallet) to help others identify the item."
                  rows={6}
                  maxLength={1000}
                  showCount
                  style={{
                    fontFamily: bodyFont,
                    fontSize: '14px',
                    borderRadius: 0,
                    border: `1px solid ${ink}`,
                    backgroundColor: paper,
                    lineHeight: 1.6
                  }}
                />
              )}
            />
          </Form.Item>
        </Col>

        {/* RIGHT COLUMN: MEDIA UPLOAD & ACTIONS */}
        <Col xs={24} lg={10}>
          
          <div 
            style={{ 
              fontFamily: monoFont, 
              fontSize: '12px', 
              fontWeight: 700, 
              letterSpacing: '1px', 
              color: inkSoft, 
              textTransform: 'uppercase',
              marginBottom: '20px',
              borderBottom: `2px dashed ${paperDeep}`,
              paddingBottom: '8px'
            }}
          >
            Evidence & Appendices
          </div>

          <Form.Item
            validateStatus={errors.media ? 'error' : ''}
            help={errors.media?.message ? <span style={{ fontFamily: monoFont, fontSize: '11px', color: claimRed }}>{errors.media.message}</span> : null}
            style={{ marginBottom: '32px' }}
          >
            <Controller
              name="media"
              control={control}
              render={({ field }) => (
                <MediaUploader
                  value={field.value}
                  onChange={field.onChange}
                  maxCount={5}
                />
              )}
            />
          </Form.Item>

          {/* ACTIONS */}
          <div style={{ marginTop: '24px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '16px',
                backgroundColor: ink,
                color: paperLight,
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: `4px 4px 0px ${typeAccentColor}`,
                opacity: isSubmitting ? 0.8 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              <Save size={18} /> {isSubmitting ? 'Logging Entry...' : submitButtonText}
            </button>
          </div>
        </Col>

      </Row>
    </Form>
  );
};

export default ItemForm;