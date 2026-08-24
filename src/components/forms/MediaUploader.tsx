import React, { useState } from 'react';
import { Upload, Progress, Typography, Card, message, Space } from 'antd';
import { UploadCloud, X } from 'lucide-react';
import { mediaService } from '../../services/mediaService';

const { Text } = Typography;

/**
 * ───────────────────────────────────────────────────────────
 *  DESIGN TOKENS — "Lost Property Office" identity
 * ───────────────────────────────────────────────────────────
 */
const ink = "#20303A";       // primary text / stamped ink
const inkSoft = "#4B5D67";   // secondary ink
const paper = "#EDE6D6";     // registry paper background
const paperLight = "#F8F4E9"; // card / ticket paper
const paperDeep = "#E2D8C1"; // recessed paper
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

interface MediaUploaderProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  value = [],
  onChange,
  maxCount = 5,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error(`${file.name} is not a supported file type (Allowed: JPEG, PNG, WEBP).`);
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error(`Image ${file.name} is too large. It must be smaller than 10MB.`);
      return false;
    }

    return true;
  };

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const fileObj = file as File;

    if (!validateFile(fileObj)) {
      onError(new Error('Validation failed'));
      return;
    }

    const fileId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    setUploadingFiles((prev) => [...prev, { id: fileId, name: fileObj.name, progress: 0 }]);

    try {
      const response = await mediaService.uploadImage(fileObj, (percent) => {
        setUploadingFiles((prev) =>
          prev.map((item) => (item.id === fileId ? { ...item, progress: percent } : item))
        );
      });

      const updatedUrls = [...value, response.url];
      if (onChange) onChange(updatedUrls);
      onSuccess(response.url);

      message.success(`${fileObj.name} uploaded successfully.`);
    } catch (err: any) {
      onError(err);
      message.error(`Failed to upload ${fileObj.name}.`);
    } finally {
      setUploadingFiles((prev) => prev.filter((item) => item.id !== fileId));
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const updatedUrls = value.filter((url) => url !== urlToRemove);
    if (onChange) onChange(updatedUrls);
    message.success('Image removed');
  };

  return (
    <Card 
      size="small" 
      style={{ 
        border: `2px solid ${ink}`, 
        borderRadius: 0, 
        backgroundColor: paper,
        padding: '8px',
        boxShadow: `3px 3px 0px ${ink}`,
        fontFamily: bodyFont
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">

        {/* DRAG AND DROP AREA (Hidden if max count reached) */}
        {value.length < maxCount && (
          <Upload.Dragger
            multiple
            customRequest={handleCustomUpload}
            showUploadList={false}
            style={{ 
              background: paperLight, 
              border: `2px dashed ${ink}`,
              borderRadius: 0,
              padding: '12px'
            }}
          >
            <div style={{ padding: '12px 0' }}>
              <p style={{ display: 'flex', justifyContent: 'center', color: ink, marginBottom: '8px' }}>
                <UploadCloud size={32} style={{ color: brass }} />
              </p>
              <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px 0', fontFamily: displayFont, color: ink, textTransform: 'uppercase' }}>
                Click or drag images here to attach
              </p>
              <p style={{ fontSize: '11px', color: inkSoft, margin: 0, fontFamily: monoFont }}>
                Up to {maxCount} files (Max 10MB each)
              </p>
            </div>
          </Upload.Dragger>
        )}

        {/* UPLOADING PROGRESS LIST */}
        {uploadingFiles.map((file) => (
          <div key={file.id} style={{ padding: '6px 8px', backgroundColor: paperLight, border: `1px solid ${ink}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Text ellipsis style={{ maxWidth: '75%', fontSize: '11px', fontFamily: monoFont, color: inkSoft, textTransform: 'uppercase' }}>
                Uploading {file.name}...
              </Text>
              <Text strong style={{ fontSize: '11px', fontFamily: monoFont, color: ink }}>{file.progress}%</Text>
            </div>
            <Progress percent={file.progress} showInfo={false} size="small" strokeColor={brass} railColor={paperDeep} />
          </div>
        ))}

        {/* PREVIEW GALLERY GRID */}
        {value.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '10px', fontFamily: monoFont, color: ink, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Attached Photos ({value.length}/{maxCount})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {value.map((url, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    position: 'relative', 
                    width: '80px', 
                    height: '80px',
                    borderRadius: 0,
                    border: `2px solid ${ink}`,
                    overflow: 'hidden',
                    backgroundColor: paperDeep,
                    boxShadow: `3px 3px 0px ${ink}`
                  }}
                >
                  <img 
                    src={url} 
                    alt={`Preview ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: ink,
                      border: `1px solid ${paperLight}`,
                      borderRadius: 0,
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: paperLight,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </Space>
    </Card>
  );
};

export default MediaUploader;