/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "./components/Navbar";
import { SystemOverview } from "./components/SystemOverview";
import { Logbook } from "./components/Logbook";
import { Initiatives } from "./components/Initiatives";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32 flex flex-col gap-8 md:gap-12">
        {/* Top Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10">
          <SystemOverview />
          <Logbook />
        </div>
        
        {/* Bottom Carousel / Grid */}
        <Initiatives />
      </main>

      <Footer />
    </div>
  );
}
