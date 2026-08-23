import React, { useState } from 'react';
import { Upload, Progress, Typography, message, Space } from 'antd';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { mediaService } from '../../services/mediaService';

const { Text } = Typography;

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
const brass = "#A9884F";     // grommet / hardware accent

const displayFont = "'Zilla Slab', 'Roboto Slab', Georgia, serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";
const bodyFont = "'Inter', 'Work Sans', system-ui, sans-serif";

interface MediaUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
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

    const fileId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Add file to uploading state
    setUploadingFiles((prev) => [...prev, { id: fileId, name: fileObj.name, progress: 0 }]);

    try {
      const response = await mediaService.uploadImage(fileObj, (percent) => {
        setUploadingFiles((prev) =>
          prev.map((item) => (item.id === fileId ? { ...item, progress: percent } : item))
        );
      });

      // Append new url
      const updatedUrls = [...value, response.url];
      onChange(updatedUrls);
      onSuccess(response.url);

      message.success(`${fileObj.name} uploaded to evidence ledger.`);
    } catch (err: any) {
      onError(err);
      message.error(`Failed to upload ${fileObj.name}.`);
    } finally {
      // Remove from uploading list
      setUploadingFiles((prev) => prev.filter((item) => item.id !== fileId));
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const updatedUrls = value.filter((url) => url !== urlToRemove);
    onChange(updatedUrls);
  };

  return (
    <div 
      style={{ 
        border: `2px dashed ${ink}`, 
        backgroundColor: paper,
        padding: '16px',
        fontFamily: bodyFont
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        
        {/* DRAG AND DROP AREA — Ledger File Stamped Box */}
        <Upload.Dragger
          multiple
          customRequest={handleCustomUpload}
          showUploadList={false}
          disabled={value.length >= maxCount}
          style={{ 
            backgroundColor: paperLight, 
            border: `1px solid ${ink}`,
            borderRadius: 0,
            padding: '12px 0'
          }}
        >
          <div style={{ padding: '16px 12px' }}>
            <p style={{ display: 'flex', justifyContent: 'center', color: ink, marginBottom: '8px' }}>
              <UploadCloud size={38} style={{ color: brass }} />
            </p>
            <p style={{ fontFamily: displayFont, fontSize: '18px', fontWeight: 700, color: ink, margin: '0 0 4px 0', textTransform: 'uppercase' }}>
              Attach Photo Evidence
            </p>
            <p style={{ fontFamily: monoFont, fontSize: '11px', color: inkSoft, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Click or drop JPEG, PNG, WEBP (Max 10MB) — [{value.length}/{maxCount} FILES ATTACHED]
            </p>
          </div>
        </Upload.Dragger>

        {/* UPLOADING FILES PROGRESS LIST */}
        {uploadingFiles.length > 0 && (
          <div style={{ backgroundColor: paperLight, border: `1px solid ${ink}`, padding: '12px' }}>
            {uploadingFiles.map((file) => (
              <div key={file.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text ellipsis style={{ fontFamily: monoFont, maxWidth: '75%', fontSize: '11px', color: inkSoft, textTransform: 'uppercase' }}>
                    Uploading {file.name}...
                  </Text>
                  <Text style={{ fontFamily: monoFont, fontSize: '11px', fontWeight: 700, color: ink }}>{file.progress}%</Text>
                </div>
                <Progress percent={file.progress} showInfo={false} size="small" strokeColor={ink} trailColor={paperDeep} />
              </div>
            ))}
          </div>
        )}

        {/* PREVIEW GALLERY */}
        {value.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: monoFont, fontWeight: 700, fontSize: '12px', color: ink, textTransform: 'uppercase', marginBottom: '10px' }}>
              <ImageIcon size={14} style={{ color: brass }} />
              ATTACHED PHOTO PROOF ({value.length})
            </div>
            <div 
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '12px' 
              }}
            >
              {value.map((url, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    position: 'relative', 
                    width: '88px', 
                    height: '88px',
                    border: `2px solid ${ink}`,
                    backgroundColor: paperLight,
                    boxShadow: `3px 3px 0px ${ink}`,
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={url} 
                    alt={`Evidence attachment preview ${idx + 1}`} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: claimRed,
                      border: `1px solid ${ink}`,
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: paperLight,
                      cursor: 'pointer',
                      padding: 0,
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
    </div>
  );
};

export default MediaUploader;