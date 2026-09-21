import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import CartDrawer from "@/features/cart/components/CartDrawer"

export default function UserLayout({
    children
} : {
    children : React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main>
                {children}
                <CartDrawer />
            </main>
            <Footer />
        </>
    )
}