import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import ReactQuill from 'react-quill';
import { ArrowLeft, Save, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ArticleEditor() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    content: '',
    summary: '',
    image_url: '',
    featured: false,
    published: true,
  });

  const [uploading, setUploading] = useState(false);

  const { data: article } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => base44.entities.Article.filter({ id: articleId }).then(res => res[0]),
    enabled: !!articleId,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order'),
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    }
  }, [article]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (articleId) {
        return base44.entities.Article.update(articleId, data);
      } else {
        return base44.entities.Article.create(data);
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['articles']);
      queryClient.invalidateQueries(['article']);
      toast.success(articleId ? 'Artigo atualizado!' : 'Artigo criado!');
      navigate(createPageUrl(`Article?id=${result.id || articleId}`));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Article.delete(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      toast.success('Artigo excluído!');
      navigate(createPageUrl('Home'));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.category_id || !formData.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
      toast.success('Imagem enviada!');
    } catch (error) {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleTitleChange = (title) => {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    setFormData({ ...formData, title, slug });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(createPageUrl('Home'))}
            className="mb-3 sm:mb-4 rounded-xl text-emerald-400 hover:bg-emerald-500/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {articleId ? 'Editar Artigo' : 'Novo Artigo'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-emerald-500/20 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Digite o título do artigo"
                className="mt-2"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">URL (Slug) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-do-artigo"
                className="mt-2"
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            <div>
              <Label htmlFor="summary">Resumo</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Breve resumo do artigo"
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Image */}
            <div>
              <Label htmlFor="image">Imagem de Capa</Label>
              <div className="mt-2 flex gap-4 items-center">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image').click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Enviando...' : 'Upload Imagem'}
                </Button>
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="h-16 w-24 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <Label>Conteúdo *</Label>
              <div className="mt-2 bg-white rounded-lg">
                <ReactQuill
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['blockquote', 'code-block'],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                  className="h-96"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-8 pt-8">
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="cursor-pointer">Artigo em Destaque</Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published" className="cursor-pointer">Publicado</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t">
              <div>
                {articleId && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este artigo?')) {
                        deleteMutation.mutate();
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl('Home'))}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveMutation.isPending ? 'Salvando...' : 'Salvar Artigo'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
