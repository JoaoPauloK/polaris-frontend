import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, LogOut, Folder, Image, CheckCircle, TrendingUp, 
  Clock, Users, Percent, ArrowUp, ArrowDown, Plus, 
  Calendar, Eye, Download
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { projectService } from '../services/project.service';
import type { Project } from '../types/project';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalPhotos: 0,
    totalSelections: 0,
    avgPhotosPerProject: 0,
    avgSelectionsPerProject: 0,
    completionRate: 0,
    pendingSelections: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data.slice(0, 6)); // Últimos 6 projetos

      // Calcular estatísticas avançadas
      const totalProjects = data.length;
      const activeProjects = data.filter((p) => p.status === 'active').length;
      const completedProjects = data.filter((p) => p.status === 'completed').length;
      const totalPhotos = data.reduce((sum, p) => sum + (p.photosCount || 0), 0);
      const totalSelections = data.reduce((sum, p) => sum + (p.selectionsCount || 0), 0);
      const avgPhotosPerProject = totalProjects > 0 ? Math.round(totalPhotos / totalProjects) : 0;
      const avgSelectionsPerProject = totalProjects > 0 ? Math.round(totalSelections / totalProjects) : 0;
      const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
      const pendingSelections = activeProjects - totalSelections;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalPhotos,
        totalSelections,
        avgPhotosPerProject,
        avgSelectionsPerProject,
        completionRate,
        pendingSelections,
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'archived':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
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
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
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
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Bem-vindo de volta, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Aqui está um resumo dos seus projetos fotográficos
          </p>
        </motion.div>

        {/* Stats Grid - Redesenhado com KPIs melhores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="group p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-primary bg-white dark:bg-gray-800 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                <ArrowUp className="w-4 h-4" strokeWidth={2} />
                <span>12%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats.totalProjects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total de Projetos
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              {stats.activeProjects} ativos • {stats.completedProjects} concluídos
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-primary bg-white dark:bg-gray-800 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                <ArrowUp className="w-4 h-4" strokeWidth={2} />
                <span>8%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats.totalPhotos.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Fotos Cadastradas
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              Média de {stats.avgPhotosPerProject} fotos/projeto
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="group p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-primary bg-white dark:bg-gray-800 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                <ArrowUp className="w-4 h-4" strokeWidth={2} />
                <span>15%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats.totalSelections}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Fotos Selecionadas
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              {stats.pendingSelections} seleções pendentes
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="group p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-primary bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 dark:bg-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Percent className="w-6 h-6 text-primary" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats.completionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
              Taxa de Conclusão
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              {stats.completedProjects} de {stats.totalProjects} finalizados
            </div>
          </motion.div>
        </div>

        {/* KPIs Secundários */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.avgSelectionsPerProject}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Média seleções/projeto</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.totalPhotos > 0 
                    ? ((stats.totalSelections / stats.totalPhotos) * 100).toFixed(1)
                    : 0}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Taxa de seleção global</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Clientes aguardando entrega</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-display font-bold mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/projects/new"
              className="group relative overflow-hidden bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl p-8 hover:shadow-2xl hover:shadow-primary/50 transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-7 h-7" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Novo Projeto
                </h3>
                <p className="text-sm opacity-90">
                  Crie um novo projeto e conecte ao Google Drive
                </p>
              </div>
            </Link>

            <Link
              to="/projects"
              className="group relative overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-primary hover:shadow-xl transition-all"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Folder className="w-7 h-7 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Ver Projetos
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie todos os seus projetos
                </p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="group relative overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-primary hover:shadow-xl transition-all"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Meu Perfil
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Atualize suas informações
                </p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Projetos Recentes</h2>
            <Link
              to="/projects"
              className="text-primary hover:underline text-sm font-semibold"
            >
              Ver todos →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 rounded-xl border-2 border-border text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-2">
                Nenhum projeto ainda
              </h3>
              <p className="text-muted-foreground mb-6">
                Crie seu primeiro projeto para começar
              </p>
              <Link
                to="/projects/new"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Criar Projeto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="block p-6 rounded-xl border-2 border-border hover:border-primary transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Image className="w-4 h-4" />
                        <span>{project.photosCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>{project.selectionsCount || 0}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
