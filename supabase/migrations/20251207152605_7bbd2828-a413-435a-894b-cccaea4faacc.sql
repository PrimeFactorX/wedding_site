-- Create storage bucket for business media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-media', 'business-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload business media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public viewing of all business media
CREATE POLICY "Public can view business media"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-media');

-- Allow users to update their own media
CREATE POLICY "Users can update own business media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'business-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own media
CREATE POLICY "Users can delete own business media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);