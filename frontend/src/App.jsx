import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import PageTransition from './components/PageTransition.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Products from './pages/Products.jsx'
import Recipes from './pages/Recipes.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Media from './pages/Media.jsx'
import Careers from './pages/Careers.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AddProduct from './pages/AddProduct.jsx'
import ManageInventory from './pages/ManageInventory.jsx'
import ViewReports from './pages/ViewReports.jsx'
import ManageUsers from './pages/ManageUsers.jsx'
import DistributorsAdmin from './pages/DistributorsAdmin.jsx'
import ShopActivity from './pages/ShopActivity.jsx'
import ManageSiteSection from './pages/ManageSiteSection.jsx'
import BecomeDistributor from './pages/BecomeDistributor.jsx'
import ManageRecipes from './pages/ManageRecipes.jsx'
import ManageCareers from './pages/ManageCareers.jsx'
import ManageContacts from './pages/ManageContacts.jsx'
import ManageMedia from './pages/ManageMedia.jsx'
import ManagingCommittee from './pages/ManagingCommittee.jsx'
import CEO from './pages/CEO.jsx'
import BoardOfDirectors from './pages/BoardOfDirectors.jsx'
import Founder from './pages/Founder.jsx'
import ManageLeadership from './pages/ManageLeadership.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import ManageNavbar from './pages/ManageNavbar.jsx'
import useReveal from './hooks/useReveal.js'

function ScrollManager({ children }) {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useReveal([location.pathname])

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <PageTransition>
        <ScrollManager>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/distributor" element={<BecomeDistributor />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/media" element={<Media />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/M.asifsiddqu@419902" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/inventory" element={<ManageInventory />} />
          <Route path="/admin/reports" element={<ViewReports />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/distributors" element={<DistributorsAdmin />} />
          <Route path="/admin/shop-activity" element={<ShopActivity />} />
          <Route path="/admin/manage/:section" element={<ManageSiteSection />} />
          <Route path="/admin/recipes" element={<ManageRecipes />} />
          <Route path="/admin/careers" element={<ManageCareers />} />
          <Route path="/admin/manage/careers" element={<ManageCareers />} />
          <Route path="/admin/manage/contacts" element={<ManageContacts />} />
          <Route path="/admin/media" element={<ManageMedia />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/board-of-directors" element={<BoardOfDirectors />} />
          <Route path="/ceo" element={<CEO />} />
          <Route path="/managing-committee" element={<ManagingCommittee />} />
          <Route path="/admin/leadership" element={<ManageLeadership />} />
          <Route path="/admin/navbar" element={<ManageNavbar />} />
        </Routes>
        </ScrollManager>
      </PageTransition>
      <Footer />
    </BrowserRouter>
  )
}
