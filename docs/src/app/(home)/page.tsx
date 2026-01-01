import Link from 'next/link';
import {
  Terminal,
  Keyboard,
  Palette,
  Package,
  ArrowRight,
  Github,
  Zap,
  Code2,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-fd-background">
      {/* Background grid + glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsla(175,70%,40%,0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsla(175,70%,40%,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-accent/20 via-accent/5 to-transparent blur-3xl rounded-full opacity-60" />
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12 lg:pt-28 lg:pb-20">
        {/* Centered ASCII Art */}
        <div className="text-center mb-8">
          <pre className="inline-block text-accent font-mono text-[10px] sm:text-xs leading-tight tracking-tight">
{`██╗  ██╗ █████╗ ██╗   ██╗██╗  ██╗████████╗██╗   ██╗██╗
██║  ██║██╔══██╗██║   ██║██║ ██╔╝╚══██╔══╝██║   ██║██║
███████║███████║██║   ██║█████╔╝    ██║   ██║   ██║██║
██╔══██║██╔══██║██║   ██║██╔═██╗    ██║   ██║   ██║██║
██║  ██║██║  ██║╚██████╔╝██║  ██╗   ██║   ╚██████╔╝██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝`}
          </pre>
        </div>

        {/* Main hero content */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            hauk<span className="text-accent">TUI</span>
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-fd-muted-foreground font-mono mb-6">
            <span className="text-accent">$</span> Beautiful components for your terminal
          </p>

          <p className="text-fd-muted-foreground max-w-2xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
            A <span className="text-fd-foreground font-medium">shadcn-like</span> component registry for Terminal UIs. 
            Copy-paste <span className="text-accent font-medium">57+ accessible</span>, keyboard-first React/Ink 
            components directly into your CLI apps.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/docs"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-fd-background font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-accent/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/docs/components"
              className="inline-flex items-center gap-2 px-8 py-4 bg-fd-card/80 hover:bg-fd-card border border-fd-border/60 text-fd-foreground font-medium rounded-lg transition-all duration-200"
            >
              <Layers className="w-4 h-4" />
              Browse Components
            </Link>

            <a
              href="https://github.com/hauktui/hauktui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-4 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Glow behind terminal */}
            <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl opacity-50" />
            
            <div className="relative rounded-xl border border-fd-border/60 bg-fd-card/90 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 bg-fd-muted/60 border-b border-fd-border/40">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/90" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/90" />
                  <span className="w-3 h-3 rounded-full bg-green-500/90" />
                </div>
                <span className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-widest">
                  hauktui@terminal ~ zsh
                </span>
                <div className="w-16" />
              </div>

              {/* Terminal content with syntax highlighting */}
              <div className="p-6 font-mono text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-accent select-none">$</span>
                  <span>
                    <span className="text-yellow-400">npx</span>
                    <span className="text-fd-foreground"> @hauktui/cli </span>
                    <span className="text-cyan-400">init</span>
                    <span className="text-fd-foreground"> my-app</span>
                  </span>
                </div>
                <p className="text-fd-muted-foreground pl-4 text-xs">
                  <span className="text-green-400">✓</span> Config file created · src/tui bootstrapped
                </p>

                <div className="flex items-start gap-2">
                  <span className="text-accent select-none">$</span>
                  <span>
                    <span className="text-yellow-400">npx</span>
                    <span className="text-fd-foreground"> @hauktui/cli </span>
                    <span className="text-cyan-400">add</span>
                    <span className="text-emerald-400"> button dialog toast</span>
                  </span>
                </div>
                <p className="text-green-400 pl-4 text-xs">
                  ✓ 3 components added to src/tui/components
                </p>

                <div className="flex items-start gap-2">
                  <span className="text-accent select-none">$</span>
                  <span>
                    <span className="text-yellow-400">npm</span>
                    <span className="text-fd-foreground"> run </span>
                    <span className="text-cyan-400">dev</span>
                  </span>
                </div>
                <p className="text-fd-muted-foreground pl-4 text-xs">
                  <span className="text-accent">▶</span> Your terminal UI is ready
                </p>

                <div className="pt-2">
                  <span className="text-accent select-none">$</span>
                  <span className="terminal-cursor ml-1">█</span>
                </div>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-fd-background/60 border-t border-fd-border/40">
                <StatItem value="57+" label="Components" />
                <StatItem value="100%" label="Keyboard accessible" />
                <StatItem value="0" label="Runtime dependencies" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats bar */}
      <section className="relative z-10 py-8 border-y border-fd-border/40 bg-fd-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickStat category="Primitives" count="6" />
            <QuickStat category="Inputs" count="17" />
            <QuickStat category="Layout" count="9" />
            <QuickStat category="Navigation & Feedback" count="22" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for the <span className="text-accent">terminal</span>
            </h2>
            <p className="text-fd-muted-foreground max-w-2xl mx-auto text-lg">
              Everything you need to build professional CLI applications with beautiful, accessible user interfaces.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Terminal className="w-5 h-5" />}
              title="Terminal Native"
              description="Components designed specifically for terminal environments. No DOM, no browser – pure terminal rendering with React and Ink."
            />
            <FeatureCard
              icon={<Keyboard className="w-5 h-5" />}
              title="Keyboard First"
              description="Full keyboard navigation with vim-style bindings, focus management, and customizable keymaps out of the box."
            />
            <FeatureCard
              icon={<Palette className="w-5 h-5" />}
              title="Design Tokens"
              description="Automatic terminal color detection with fallbacks. Create consistent themes that adapt to any terminal emulator."
            />
            <FeatureCard
              icon={<Code2 className="w-5 h-5" />}
              title="Copy & Paste"
              description="Like shadcn/ui, components are copied into your project. Full ownership, full customization, no runtime deps."
            />
            <FeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="TypeScript Native"
              description="Written in TypeScript with full type definitions. Excellent DX with autocomplete and comprehensive type checking."
            />
            <FeatureCard
              icon={<Package className="w-5 h-5" />}
              title="Powerful CLI"
              description="Initialize projects, add components, and manage your TUI with a single command. Built for developer productivity."
            />
          </div>
        </div>
      </section>

      {/* Component Categories */}
      <section className="relative z-10 py-24 px-6 bg-fd-card/20 border-y border-fd-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Component Categories</h2>
            <p className="text-fd-muted-foreground max-w-2xl mx-auto text-lg">
              From primitives to complex data visualization, everything you need in one registry.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <CategoryCard
              title="Primitives"
              count={6}
              color="blue"
              items={['Button', 'Badge', 'Avatar', 'Kbd', 'Label', 'Typography']}
            />
            <CategoryCard
              title="Input"
              count={17}
              color="emerald"
              items={['TextInput', 'Select', 'Checkbox', 'Slider', 'DatePicker', 'Form']}
            />
            <CategoryCard
              title="Layout"
              count={9}
              color="amber"
              items={['Card', 'Table', 'Accordion', 'Resizable', 'DataTable', 'List']}
            />
            <CategoryCard
              title="Navigation"
              count={8}
              color="violet"
              items={['Tabs', 'Breadcrumb', 'Sidebar', 'Menubar', 'Pagination']}
            />
            <CategoryCard
              title="Feedback"
              count={14}
              color="rose"
              items={['Dialog', 'Toast', 'Alert', 'Progress', 'Spinner', 'Drawer']}
            />
            <CategoryCard
              title="Display"
              count={3}
              color="cyan"
              items={['Banner', 'Chart', 'Carousel']}
            />
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple to Use</h2>
            <p className="text-fd-muted-foreground text-lg">
              Import, render, done. Components work seamlessly with React and Ink.
            </p>
          </div>

          <div className="rounded-xl border border-fd-border/60 bg-fd-card/80 overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-fd-muted/50 border-b border-fd-border/40">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="ml-3 font-mono text-xs text-fd-muted-foreground">app.tsx</span>
            </div>
            <pre className="p-6 overflow-x-auto font-mono text-sm leading-relaxed">
              <code>
                <span className="text-violet-400">import</span>
                <span className="text-fd-foreground"> {'{ render }'} </span>
                <span className="text-violet-400">from</span>
                <span className="text-emerald-400"> 'ink'</span>
                <span className="text-fd-foreground">;</span>
                {'\n'}
                <span className="text-violet-400">import</span>
                <span className="text-fd-foreground"> {'{ TokenProvider, FocusGroup }'} </span>
                <span className="text-violet-400">from</span>
                <span className="text-emerald-400"> '@hauktui/primitives-ink'</span>
                <span className="text-fd-foreground">;</span>
                {'\n'}
                <span className="text-violet-400">import</span>
                <span className="text-fd-foreground"> {'{ Button, Dialog, Toast }'} </span>
                <span className="text-violet-400">from</span>
                <span className="text-emerald-400"> './tui/components'</span>
                <span className="text-fd-foreground">;</span>
                {'\n\n'}
                <span className="text-violet-400">function</span>
                <span className="text-cyan-400"> App</span>
                <span className="text-fd-foreground">() {'{'}</span>
                {'\n'}
                <span className="text-fd-foreground">  </span>
                <span className="text-violet-400">const</span>
                <span className="text-fd-foreground"> [showDialog, setShowDialog] = </span>
                <span className="text-cyan-400">useState</span>
                <span className="text-fd-foreground">(</span>
                <span className="text-amber-400">false</span>
                <span className="text-fd-foreground">);</span>
                {'\n\n'}
                <span className="text-fd-foreground">  </span>
                <span className="text-violet-400">return</span>
                <span className="text-fd-foreground"> (</span>
                {'\n'}
                <span className="text-fd-foreground">    </span>
                <span className="text-cyan-400">{'<TokenProvider>'}</span>
                {'\n'}
                <span className="text-fd-foreground">      </span>
                <span className="text-cyan-400">{'<FocusGroup>'}</span>
                {'\n'}
                <span className="text-fd-foreground">        </span>
                <span className="text-cyan-400">{'<Button'}</span>
                <span className="text-amber-400"> onPress</span>
                <span className="text-fd-foreground">={'={() => setShowDialog(true)}'}</span>
                <span className="text-cyan-400">{'>'}</span>
                {'\n'}
                <span className="text-fd-foreground">          Open Dialog</span>
                {'\n'}
                <span className="text-fd-foreground">        </span>
                <span className="text-cyan-400">{'</Button>'}</span>
                {'\n'}
                <span className="text-fd-foreground">        </span>
                <span className="text-cyan-400">{'<Toast'}</span>
                <span className="text-amber-400"> message</span>
                <span className="text-fd-foreground">=</span>
                <span className="text-emerald-400">"Added!"</span>
                <span className="text-amber-400"> variant</span>
                <span className="text-fd-foreground">=</span>
                <span className="text-emerald-400">"success"</span>
                <span className="text-cyan-400"> {'/>'}</span>
                {'\n'}
                <span className="text-fd-foreground">      </span>
                <span className="text-cyan-400">{'</FocusGroup>'}</span>
                {'\n'}
                <span className="text-fd-foreground">    </span>
                <span className="text-cyan-400">{'</TokenProvider>'}</span>
                {'\n'}
                <span className="text-fd-foreground">  );</span>
                {'\n'}
                <span className="text-fd-foreground">{'}'}</span>
                {'\n\n'}
                <span className="text-cyan-400">render</span>
                <span className="text-fd-foreground">(</span>
                <span className="text-cyan-400">{'<App />'}</span>
                <span className="text-fd-foreground">);</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 border-t border-fd-border/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to build something <span className="text-accent">beautiful</span>?
          </h2>
          <p className="text-fd-muted-foreground mb-10 text-lg max-w-xl mx-auto">
            Get started in seconds. Install the CLI, add components, and build terminal applications 
            that feel as polished as your favorite GUI tools.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-4 mb-10 rounded-lg bg-fd-card/80 border border-fd-border/60 font-mono text-sm">
            <span className="text-accent">$</span>
            <span className="text-fd-foreground">npm install -g @hauktui/cli</span>
            <button className="ml-4 p-2 rounded hover:bg-fd-muted/50 transition-colors text-fd-muted-foreground hover:text-fd-foreground">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/docs"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-fd-background font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-accent/20"
            >
              Read the Docs
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs/components"
              className="inline-flex items-center gap-2 px-8 py-4 text-fd-muted-foreground hover:text-fd-foreground font-medium transition-colors"
            >
              Explore Components
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6 border-t border-fd-border/40 bg-fd-card/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-bold text-fd-foreground">hauk</span>
            <span className="font-bold text-accent">TUI</span>
            <span className="text-xs text-fd-muted-foreground ml-2">v1.0.0</span>
          </div>

          <nav className="flex items-center gap-8 text-sm text-fd-muted-foreground">
            <Link href="/docs" className="hover:text-fd-foreground transition-colors">
              Documentation
            </Link>
            <Link href="/docs/components" className="hover:text-fd-foreground transition-colors">
              Components
            </Link>
            <a
              href="https://github.com/hauktui/hauktui"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fd-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>

          <p className="text-sm text-fd-muted-foreground">
            Built with <span className="text-accent">♥</span> for the terminal
          </p>
        </div>
      </footer>
    </main>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold font-mono text-accent">{value}</div>
      <div className="text-xs text-fd-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function QuickStat({ category, count }: { category: string; count: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-fd-card/50 border border-fd-border/40">
      <span className="text-sm text-fd-muted-foreground">{category}</span>
      <span className="text-xl font-bold font-mono text-fd-foreground">{count}</span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-xl bg-fd-card/60 border border-fd-border/50 hover:border-accent/40 transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-fd-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function CategoryCard({
  title,
  count,
  color,
  items,
}: {
  title: string;
  count: number;
  color: string;
  items: string[];
}) {
  const colorMap: Record<string, { border: string; bg: string; text: string }> = {
    blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400' },
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-400' },
    amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400' },
    violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/5', text: 'text-violet-400' },
    rose: { border: 'border-rose-500/30', bg: 'bg-rose-500/5', text: 'text-rose-400' },
    cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', text: 'text-cyan-400' },
  };

  const colors = colorMap[color] || colorMap.cyan;

  return (
    <Link
      href={`/docs/components#${title.toLowerCase()}`}
      className={`group block p-5 rounded-xl border ${colors.border} ${colors.bg} hover:border-opacity-60 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${colors.text}`}>{title}</h3>
        <span className="text-xs font-mono text-fd-muted-foreground">{count}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 5).map((item) => (
          <span
            key={item}
            className="px-2 py-1 text-[11px] font-mono rounded bg-fd-background/80 text-fd-foreground/80"
          >
            {item}
          </span>
        ))}
        {count > 5 && (
          <span className="px-2 py-1 text-[11px] text-fd-muted-foreground">
            +{count - 5} more
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs text-fd-muted-foreground group-hover:text-accent transition-colors">
        <span>View all</span>
        <ChevronRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
