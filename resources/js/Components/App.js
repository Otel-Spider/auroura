import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header, SiteFooter } from './shared/components';
import { footerData } from './shared/components/SiteFooter/footerData.jsx';
import Home from './pages/Home.jsx';

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <Home />
            </main>
            <SiteFooter
                brand={footerData.brand}
                columns={footerData.columns}
                socials={footerData.socials}
                partnerBrands={footerData.partnerBrands}
                legalLinks={footerData.legalLinks}
                copyrightText={footerData.copyrightText}
            />
        </div>
    );
}

export default App;
