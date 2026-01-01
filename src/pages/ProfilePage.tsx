import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, LogOut, User, Mail, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async () => {
    setErrors({});
    setSuccess('');

    // Validação
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória para alterar a senha';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      // TODO: Implementar atualização do perfil
      // await authService.updateProfile(formData);
      
      setSuccess('Perfil atualizado com sucesso!');
      setEditing(false);
      
      // Limpar senhas
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.error || 'Erro ao atualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header - Navbar melhorada */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div whileHover={{ rotate: 12, scale: 1.1 }}>
                  <Camera className="w-7 h-7 text-primary" strokeWidth={2} />
                </motion.div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Polaris
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Projetos
                </Link>
                <Link to="/profile" className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold transition-colors">
                  Perfil
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline font-medium">
                {user?.name}
              </span>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                <span className="font-medium">Sair</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Meu Perfil
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie suas informações pessoais
          </p>

          <div className="space-y-6">
            {/* Avatar */}
            <div className="p-6 rounded-xl border-2 border-border">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors font-semibold"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>

            {/* Edit Form */}
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-6 rounded-xl border-2 border-primary/50 bg-primary/5"
              >
                <h3 className="text-lg font-bold mb-4">Editar Informações</h3>
                
                <div className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.name ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.email ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="py-4 border-t border-border">
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                      Alterar Senha (opcional)
                    </h4>
                  </div>

                  {/* Senha Atual */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.currentPassword ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* Nova Senha */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.newPassword ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.confirmPassword ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Error/Success Messages */}
                  {errors.submit && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg">
                      <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
                    </div>
                  )}

                  {success && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg">
                      <p className="text-green-600 dark:text-green-400">{success}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setErrors({});
                        setSuccess('');
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                      className="px-6 py-3 border-2 border-border rounded-lg hover:border-primary transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            <div className="p-6 rounded-xl border-2 border-border">
              <h3 className="text-lg font-bold mb-4">Estatísticas da Conta</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Projetos criados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">847</div>
                  <div className="text-sm text-muted-foreground">Fotos enviadas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">89%</div>
                  <div className="text-sm text-muted-foreground">Taxa de seleção</div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-xl border-2 border-red-500/50 bg-red-50 dark:bg-red-900/10">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                Zona de Perigo
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ações irreversíveis com sua conta
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Excluir Conta
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
