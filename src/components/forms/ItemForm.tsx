import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Select, DatePicker, Button, Radio, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { ITEM_CATEGORIES, type ItemType } from '../../types/item';
import MediaUploader from './MediaUploader';

const { TextArea } = Input;

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
// const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const claimRed = "#A23E2E";  // LOST tag / alert highlight
const claimGreen = "#3E6C52"; // FOUND tag
const brass = "#A9884F";     // grommet / hardware accent

// const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
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
  imageUrls: z.array(z.string()).default([]),
});

// Explicitly define input and output form types to satisfy react-hook-form + zodResolver
export type ItemFormData = z.infer<typeof itemFormSchema>;
type ItemFormInput = z.input<typeof itemFormSchema>;

interface ItemFormProps {
  initialValues?: {
    type?: ItemType;
    title?: string;
    category?: string;
    description?: string;
    location?: string;
    date?: any;
    dateString?: string;
    imageUrls?: string[];
  };
  onSubmit: (data: ItemFormData & { formattedDate: string }) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  fixedType?: ItemType;
}

const ItemForm: React.FC<ItemFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Submit Report',
  fixedType,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormInput, any, ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
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
      imageUrls: initialValues?.imageUrls && initialValues.imageUrls.length > 0 
        ? initialValues.imageUrls 
        : [],
    },
  });

  const onFormSubmit = (data: ItemFormData) => {
    const formattedDate = dayjs(data.date).toISOString();
    onSubmit({
      ...data,
      formattedDate,
    });
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: monoFont,
    fontSize: '11px',
    fontWeight: 700,
    color: ink,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onFormSubmit)} style={{ fontFamily: bodyFont }}>
      <Row gutter={32}>

        {/* LEFT COLUMN: BASIC METADATA */}
        <Col xs={24} lg={14}>

          {/* TYPE FIELD */}
          {!fixedType && (
            <Form.Item
              label={<span style={labelStyle}>Report Type</span>}
              validateStatus={errors.type ? 'error' : ''}
              help={errors.type?.message}
              required
            >
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Radio.Group {...field} buttonStyle="solid" style={{ width: '100%' }}>
                    <Radio.Button 
                      value="LOST" 
                      style={{ 
                        width: '50%', 
                        textAlign: 'center', 
                        borderColor: ink, 
                        backgroundColor: field.value === 'LOST' ? claimRed : paper,
                        color: field.value === 'LOST' ? paperLight : ink,
                        fontFamily: monoFont,
                        fontWeight: 700,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        borderRadius: 0,
                        height: '42px',
                        lineHeight: '40px',
                        boxShadow: field.value === 'LOST' ? `2px 2px 0px ${ink}` : 'none'
                      }}
                    >
                      LOST ITEM
                    </Radio.Button>
                    <Radio.Button 
                      value="FOUND" 
                      style={{ 
                        width: '50%', 
                        textAlign: 'center', 
                        borderColor: ink, 
                        backgroundColor: field.value === 'FOUND' ? claimGreen : paper,
                        color: field.value === 'FOUND' ? paperLight : ink,
                        fontFamily: monoFont,
                        fontWeight: 700,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        borderRadius: 0,
                        height: '42px',
                        lineHeight: '40px',
                        boxShadow: field.value === 'FOUND' ? `2px 2px 0px ${ink}` : 'none'
                      }}
                    >
                      FOUND ITEM
                    </Radio.Button>
                  </Radio.Group>
                )}
              />
            </Form.Item>
          )}

          {/* TITLE FIELD */}
          <Form.Item
            label={<span style={labelStyle}>Item Title</span>}
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
            required
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  placeholder="e.g. iPhone 15 Pro, Black Trifold Wallet" 
                  maxLength={100} 
                  size="large" 
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              )}
            />
          </Form.Item>

          {/* CATEGORY & DATE */}
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={labelStyle}>Category</span>}
                validateStatus={errors.category ? 'error' : ''}
                help={errors.category?.message}
                required
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      {...field} 
                      placeholder="Select item category" 
                      size="large"
                      style={{ width: '100%' }}
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
                label={<span style={labelStyle}>Date Lost / Found</span>}
                validateStatus={errors.date ? 'error' : ''}
                help={errors.date?.message as string}
                required
              >
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker 
                      {...field} 
                      style={{ 
                        width: '100%',
                        backgroundColor: paper,
                        border: `1.5px solid ${ink}`,
                        borderRadius: 0,
                      }} 
                      size="large" 
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
            label={<span style={labelStyle}>Location</span>}
            validateStatus={errors.location ? 'error' : ''}
            help={errors.location?.message}
            required
          >
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  placeholder="e.g. Science Library, 2nd floor study area" 
                  size="large" 
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              )}
            />
          </Form.Item>

          {/* DESCRIPTION FIELD */}
          <Form.Item
            label={<span style={labelStyle}>Detailed Description</span>}
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
            required
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder="Provide distinct characteristics to help others identify the item (e.g. scratches, lock screen wallpaper, distinct keychains)."
                  rows={6}
                  maxLength={1000}
                  showCount
                  style={{
                    backgroundColor: paper,
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    fontFamily: bodyFont,
                    color: ink,
                  }}
                />
              )}
            />
          </Form.Item>
        </Col>

        {/* RIGHT COLUMN: MULTIPLE MEDIA UPLOAD */}
        <Col xs={24} lg={10}>
          <Form.Item
            label={<span style={labelStyle}>Upload Images (Up to 5)</span>}
            validateStatus={errors.imageUrls ? 'error' : ''}
            help={errors.imageUrls?.message}
          >
            <Controller
              name="imageUrls"
              control={control}
              render={({ field }) => (
                <MediaUploader
                  value={field.value || []}
                  onChange={field.onChange}
                  maxCount={5}
                />
              )}
            />
          </Form.Item>

          {/* ACTIONS */}
          <div style={{ marginTop: '32px' }}>
            <Button 
              size="large" 
              type="primary" 
              htmlType="submit" 
              loading={isSubmitting} 
              block
              style={{
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                height: '48px',
                backgroundColor: ink,
                borderColor: ink,
                color: paperLight,
                borderRadius: 0,
                boxShadow: `4px 4px 0px ${brass}`,
              }}
            >
              {submitButtonText}
            </Button>
          </div>
        </Col>

      </Row>
    </Form>
  );
};

export default ItemForm;