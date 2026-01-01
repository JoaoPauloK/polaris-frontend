import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, LogOut, Plus, Search, Filter, Image, CheckCircle, Archive, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { projectService } from '../services/project.service';
import type { Project } from '../types/project';

export default function ProjectsPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-700';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-300 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-300 dark:border-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Finalizado';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

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
                <Link to="/projects" className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold transition-colors">
                  Projetos
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
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
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-display font-bold mb-2">
              Meus Projetos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto' : 'projetos'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/projects/new"
              className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-primary/50 transition-all font-semibold"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span>Novo Projeto</span>
            </Link>
          </motion.div>
        </div>

        {/* Filters - Melhorados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" strokeWidth={2} />
            <input
              type="text"
              placeholder="Buscar por título, descrição ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-colors bg-white dark:bg-gray-800"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" strokeWidth={2} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-8 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-colors bg-white dark:bg-gray-800 appearance-none cursor-pointer font-medium min-w-[180px]"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="completed">Finalizados</option>
              <option value="archived">Arquivados</option>
            </select>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-16 rounded-2xl border-2 border-gray-200 dark:border-gray-800 text-center bg-white dark:bg-gray-800"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-primary" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhum projeto encontrado'
                : 'Nenhum projeto ainda'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Crie seu primeiro projeto para começar a organizar suas galerias fotográficas'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/projects/new"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-primary/50 transition-all font-semibold"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  Criar Primeiro Projeto
                </Link>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="block p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-primary hover:shadow-xl transition-all group h-full bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 flex-1">
                      {project.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 flex items-center gap-1 ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status === 'active' && <Clock className="w-3 h-3" strokeWidth={2} />}
                      {project.status === 'completed' && <CheckCircle className="w-3 h-3" strokeWidth={2} />}
                      {project.status === 'archived' && <Archive className="w-3 h-3" strokeWidth={2} />}
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Image className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={2} />
                      </div>
                      <span className="font-medium">{project.photosCount || 0} fotos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" strokeWidth={2} />
                      </div>
                      <span className="font-medium">{project.selectionsCount || 0} seleções</span>
                    </div>
                  </div>

                  {project.packagePhotosCount && (
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-500 font-medium">
                      Pacote: {project.packagePhotosCount} fotos incluídas
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
