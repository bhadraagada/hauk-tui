import React, { useState } from "react";
import { render, Box, Text, useInput } from "ink";
import { createTokens } from "@hauktui/tokens";
import {
  TokenProvider,
  FocusGroup,
  Panel,
  Divider,
  ThemedText,
} from "@hauktui/primitives-ink";

// Import all registry components
import { Accordion } from "./tui/components/accordion/index.js";
import { Alert } from "./tui/components/alert/index.js";
import { Avatar } from "./tui/components/avatar/index.js";
import { Badge } from "./tui/components/badge/index.js";
import { Breadcrumb } from "./tui/components/breadcrumb/index.js";
import { Button } from "./tui/components/button/index.js";
import { Card } from "./tui/components/card/index.js";
import { Checkbox } from "./tui/components/checkbox/index.js";
import { ConfirmDialog } from "./tui/components/confirm-dialog/index.js";
import { Dialog } from "./tui/components/dialog/index.js";
import { Kbd } from "./tui/components/kbd/index.js";
import { Label } from "./tui/components/label/index.js";
import { List } from "./tui/components/list/index.js";
import { Pagination } from "./tui/components/pagination/index.js";
import { PasswordInput } from "./tui/components/password-input/index.js";
import { Progress } from "./tui/components/progress/index.js";
import { RadioGroup } from "./tui/components/radio-group/index.js";
import { Select } from "./tui/components/select/index.js";
import { Separator } from "./tui/components/separator/index.js";
import { Skeleton } from "./tui/components/skeleton/index.js";
import { Slider } from "./tui/components/slider/index.js";
import { Spinner } from "./tui/components/spinner/index.js";
import { Table } from "./tui/components/table/index.js";
import { Tabs } from "./tui/components/tabs/index.js";
import { TextInput } from "./tui/components/text-input/index.js";
import { Textarea } from "./tui/components/textarea/index.js";
import { Toast } from "./tui/components/toast/index.js";
import { Toggle } from "./tui/components/toggle/index.js";

// New components (session 2)
import { Banner } from "./tui/components/banner/index.js";
import { Collapsible } from "./tui/components/collapsible/index.js";
import { Command } from "./tui/components/command/index.js";
import { Empty } from "./tui/components/empty/index.js";
import { Field } from "./tui/components/field/index.js";
import { InputOTP } from "./tui/components/input-otp/index.js";
import { ScrollArea } from "./tui/components/scroll-area/index.js";
import { ToggleGroup } from "./tui/components/toggle-group/index.js";
import { Typography } from "./tui/components/typography/index.js";

// New components (session 3) - overlays & menus
import { AlertDialog } from "./tui/components/alert-dialog/index.js";
import { Combobox } from "./tui/components/combobox/index.js";
import { ContextMenu } from "./tui/components/context-menu/index.js";
import { Drawer } from "./tui/components/drawer/index.js";
import { DropdownMenu } from "./tui/components/dropdown-menu/index.js";
import { Menubar } from "./tui/components/menubar/index.js";
import { Popover } from "./tui/components/popover/index.js";
import { Sheet } from "./tui/components/sheet/index.js";
import { Sidebar } from "./tui/components/sidebar/index.js";
import { Tooltip } from "./tui/components/tooltip/index.js";

// New components (session 4) - data & forms
import { Switch } from "./tui/components/switch/index.js";
import { HoverCard } from "./tui/components/hover-card/index.js";
import { NavigationMenu } from "./tui/components/navigation-menu/index.js";
import { Resizable } from "./tui/components/resizable/index.js";
import { Calendar } from "./tui/components/calendar/index.js";
import { DatePicker } from "./tui/components/date-picker/index.js";
import { Carousel } from "./tui/components/carousel/index.js";
import { Chart } from "./tui/components/chart/index.js";
import { DataTable } from "./tui/components/data-table/index.js";
import { Form, FormField, FormMessage } from "./tui/components/form/index.js";

// Custom tokens
const tokens = createTokens({
  colors: {
    accent: "#8b5cf6",
    focus: "#a78bfa",
  },
});

type Screen =
  | "menu"
  | "inputs"
  | "selection"
  | "list"
  | "tabs"
  | "dialog"
  | "feedback"
  | "display"
  | "layout"
  | "new-components"
  | "command-palette"
  | "overlays"
  | "menus"
  | "data-forms";

function App() {
  const [screen, setScreen] = useState<Screen>("menu");

  useInput((input, key) => {
    if (key.escape && screen !== "menu") {
      setScreen("menu");
    }
    if (screen === "menu") {
      if (input === "1") setScreen("inputs");
      if (input === "2") setScreen("selection");
      if (input === "3") setScreen("list");
      if (input === "4") setScreen("tabs");
      if (input === "5") setScreen("dialog");
      if (input === "6") setScreen("feedback");
      if (input === "7") setScreen("display");
      if (input === "8") setScreen("layout");
      if (input === "9") setScreen("new-components");
      if (input === "0") setScreen("command-palette");
      if (input === "a") setScreen("overlays");
      if (input === "b") setScreen("menus");
      if (input === "c") setScreen("data-forms");
      if (input === "q") process.exit(0);
    }
  });

  return (
    <TokenProvider tokens={tokens}>
      {screen === "menu" && <MenuScreen />}
      {screen === "inputs" && <InputsDemo />}
      {screen === "selection" && <SelectionDemo />}
      {screen === "list" && <ListDemo />}
      {screen === "tabs" && <TabsDemo />}
      {screen === "dialog" && <DialogDemo />}
      {screen === "feedback" && <FeedbackDemo />}
      {screen === "display" && <DisplayDemo />}
      {screen === "layout" && <LayoutDemo />}
      {screen === "new-components" && <NewComponentsDemo />}
      {screen === "command-palette" && <CommandPaletteDemo />}
      {screen === "overlays" && <OverlaysDemo />}
      {screen === "menus" && <MenusDemo />}
      {screen === "data-forms" && <DataFormsDemo />}
    </TokenProvider>
  );
}

function MenuScreen() {
  return (
    <Box flexDirection="column" padding={1}>
      <Panel
        title="haukTUI Component Showcase - 57 Components"
        borderStyle="round"
      >
        <Box flexDirection="column" gap={1}>
          <ThemedText color="accent" bold>
            Test the actual registry components!
          </ThemedText>
          <Divider width={60} />
          <Box flexDirection="column">
            <Text>
              [1] Input Components (TextInput, PasswordInput, Textarea, Slider)
            </Text>
            <Text>
              [2] Selection Components (Checkbox, Toggle, RadioGroup, Select)
            </Text>
            <Text>[3] List Component</Text>
            <Text>[4] Tabs & Pagination</Text>
            <Text>[5] Dialog Components (Dialog, ConfirmDialog)</Text>
            <Text>
              [6] Feedback (Alert, Toast, Progress, Spinner, Skeleton)
            </Text>
            <Text>[7] Display (Badge, Avatar, Kbd, Label, Breadcrumb)</Text>
            <Text>[8] Layout (Card, Accordion, Table, Separator)</Text>
            <Text color="cyan">
              [9] Session 2: Banner, Typography, Field, InputOTP, Collapsible...
            </Text>
            <Text color="cyan">[0] Command Palette Demo</Text>
            <Text color="magenta">
              [a] Overlays (Drawer, Sheet, Popover, Tooltip, AlertDialog)
            </Text>
            <Text color="magenta">
              [b] Menus (DropdownMenu, ContextMenu, Menubar, Sidebar, Combobox)
            </Text>
            <Text color="green">
              [c] NEW: Data & Forms (Chart, Calendar, DatePicker, DataTable,
              Form...)
            </Text>
            <Text>[q] Quit</Text>
          </Box>
          <Divider width={60} />
          <ThemedText color="muted">
            Press a key to select, ESC to go back
          </ThemedText>
        </Box>
      </Panel>
    </Box>
  );
}

function InputsDemo() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [multiline, setMultiline] = useState("Type here...\nMultiple lines!");
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Input Components" borderStyle="round">
        <FocusGroup>
          <Box flexDirection="column" gap={1}>
            <TextInput
              label="Username"
              placeholder="Enter your username"
              value={text}
              onChange={setText}
              focusId="username"
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              focusId="password"
            />

            <Textarea
              label="Bio"
              value={multiline}
              onChange={setMultiline}
              focusId="bio"
              rows={3}
            />

            <Slider
              label="Volume"
              value={sliderValue}
              onChange={setSliderValue}
              min={0}
              max={100}
              focusId="slider"
            />

            <Box gap={2}>
              <Button
                onPress={() => console.log("Submitted:", { text, password })}
                focusId="submit"
                variant="primary"
              >
                Submit
              </Button>

              <Button
                onPress={() => console.log("Cancelled")}
                focusId="cancel"
                variant="ghost"
              >
                Cancel
              </Button>
            </Box>

            <Divider width={50} />
            <ThemedText color="muted">
              TAB to switch fields, Enter to submit
            </ThemedText>
            <ThemedText color="muted">ESC to go back</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function SelectionDemo() {
  const [checked, setChecked] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [radioValue, setRadioValue] = useState("opt1");
  const [selectValue, setSelectValue] = useState("apple");

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Selection Components" borderStyle="round">
        <FocusGroup>
          <Box flexDirection="column" gap={1}>
            <Checkbox
              label="I agree to the terms and conditions"
              checked={checked}
              onChange={setChecked}
              focusId="checkbox"
            />

            <Toggle
              label="Enable notifications"
              value={toggled}
              onChange={setToggled}
              focusId="toggle"
            />

            <Divider width={40} />

            <RadioGroup
              label="Select your plan"
              options={[
                { label: "Free", value: "free" },
                { label: "Pro ($10/mo)", value: "pro" },
                { label: "Enterprise", value: "enterprise" },
              ]}
              value={radioValue}
              onChange={setRadioValue}
              focusId="radio"
            />

            <Divider width={40} />

            <Select
              options={[
                { label: "Apple", value: "apple" },
                { label: "Banana", value: "banana" },
                { label: "Cherry", value: "cherry" },
                { label: "Dragon Fruit", value: "dragonfruit" },
              ]}
              value={selectValue}
              onChange={setSelectValue}
              focusId="select"
              expanded
            />

            <Divider width={40} />
            <ThemedText color="muted">
              TAB to switch, Space/Enter to toggle
            </ThemedText>
            <ThemedText color="muted">ESC to go back</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function ListDemo() {
  const [selected, setSelected] = useState("item1");

  const items = [
    {
      label: "Getting Started",
      value: "item1",
      description: "Introduction to haukTUI",
    },
    {
      label: "Installation",
      value: "item2",
      description: "How to install the CLI",
    },
    {
      label: "Configuration",
      value: "item3",
      description: "Setting up your project",
    },
    {
      label: "Components",
      value: "item4",
      description: "Available UI components",
    },
    {
      label: "Theming",
      value: "item5",
      description: "Customize colors and styles",
    },
    {
      label: "Keyboard Navigation",
      value: "item6",
      description: "Focus and keymaps",
    },
    {
      label: "API Reference",
      value: "item7",
      description: "Complete documentation",
    },
    { label: "Examples", value: "item8", description: "Sample applications" },
    { label: "Contributing", value: "item9", description: "How to contribute" },
    { label: "Changelog", value: "item10", description: "Version history" },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="List Component" borderStyle="round">
        <FocusGroup initialFocusId="list">
          <Box flexDirection="column" gap={1}>
            <List
              items={items}
              value={selected}
              onChange={setSelected}
              onSelect={(val) => console.log("Selected:", val)}
              maxHeight={6}
              showDescriptions
              focusId="list"
            />

            <Divider width={50} />
            <ThemedText color="muted">
              Up/Down or j/k to navigate, g/G for top/bottom
            </ThemedText>
            <ThemedText color="muted">
              Enter to select, ESC to go back
            </ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function TabsDemo() {
  const [activeTab, setActiveTab] = useState("overview");
  const [page, setPage] = useState(1);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "features", label: "Features" },
    { key: "install", label: "Install" },
    { key: "docs", label: "Docs" },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Tabs & Pagination" borderStyle="round">
        <FocusGroup initialFocusId="tabs">
          <Box flexDirection="column" gap={1}>
            <Tabs
              tabs={tabs}
              activeKey={activeTab}
              onChange={setActiveTab}
              focusId="tabs"
              variant="boxed"
            />

            <Divider width={50} />

            <Box paddingX={1}>
              {activeTab === "overview" && (
                <Text>haukTUI is a component registry for Terminal UIs.</Text>
              )}
              {activeTab === "features" && (
                <Text>
                  Design tokens, keyboard nav, focus management, and more!
                </Text>
              )}
              {activeTab === "install" && (
                <Text>npm install -g @hauktui/cli && hauktui init</Text>
              )}
              {activeTab === "docs" && (
                <Text>Full documentation at github.com/hauktui/hauktui</Text>
              )}
            </Box>

            <Divider width={50} />

            <Pagination
              page={page}
              totalPages={10}
              onChange={setPage}
              focusId="pagination"
            />

            <Divider width={50} />
            <ThemedText color="muted">
              Left/Right to switch tabs/pages, 1-9 for quick access
            </ThemedText>
            <ThemedText color="muted">
              TAB to switch focus, ESC to go back
            </ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function DialogDemo() {
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  useInput((input) => {
    if (!showConfirm && !showDialog && (input === " " || input === "r")) {
      setShowConfirm(true);
      setResult(null);
    }
    if (input === "d") {
      setShowDialog(!showDialog);
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Dialog Components" borderStyle="round">
        <FocusGroup>
          <Box flexDirection="column" gap={1}>
            {showConfirm ? (
              <ConfirmDialog
                title="Confirm Action"
                message="Are you sure you want to proceed with this operation?"
                onConfirm={() => {
                  setResult("Confirmed!");
                  setShowConfirm(false);
                }}
                onCancel={() => {
                  setResult("Cancelled!");
                  setShowConfirm(false);
                }}
              />
            ) : (
              <Box flexDirection="column" gap={1}>
                <ThemedText
                  bold
                  color={result === "Confirmed!" ? "success" : "danger"}
                >
                  {result}
                </ThemedText>
                <ThemedText color="muted">
                  Press SPACE or R to show confirm dialog again
                </ThemedText>
              </Box>
            )}

            <Divider width={50} />

            {showDialog && (
              <Dialog
                title="Information Dialog"
                open={showDialog}
                onClose={() => setShowDialog(false)}
                focusId="dialog"
              >
                <Text>This is a modal dialog. Press ESC or Q to close.</Text>
              </Dialog>
            )}

            <ThemedText color="muted">Press D to toggle Dialog</ThemedText>
            <ThemedText color="muted">ESC to go back to menu</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function FeedbackDemo() {
  const [progress, setProgress] = useState(65);

  // Simulate progress
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 5));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Feedback Components" borderStyle="round">
        <Box flexDirection="column" gap={1}>
          <Alert variant="info" title="Information">
            This is an info alert message.
          </Alert>

          <Alert variant="success" title="Success">
            Operation completed successfully!
          </Alert>

          <Alert variant="warning" title="Warning">
            Please review before continuing.
          </Alert>

          <Alert variant="error" title="Error">
            Something went wrong.
          </Alert>

          <Divider width={50} />

          <Box gap={2}>
            <Spinner variant="dots" label="Loading" />
            <Spinner variant="line" />
            <Spinner variant="arc" />
          </Box>

          <Progress value={progress} width={40} showLabel />

          <Divider width={50} />

          <Box gap={2}>
            <Skeleton width={15} />
            <Skeleton width={10} variant="circular" />
          </Box>

          <Divider width={50} />

          <Toast
            message="This is a toast notification!"
            variant="success"
            duration={0}
          />

          <ThemedText color="muted">ESC to go back</ThemedText>
        </Box>
      </Panel>
    </Box>
  );
}

function DisplayDemo() {
  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Display Components" borderStyle="round">
        <Box flexDirection="column" gap={1}>
          <Box gap={2} alignItems="center">
            <Text>Avatars:</Text>
            <Avatar name="John Doe" size="sm" />
            <Avatar name="Jane Smith" size="md" />
            <Avatar name="Bob" size="lg" />
          </Box>

          <Divider width={50} />

          <Box gap={1}>
            <Text>Badges:</Text>
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Error</Badge>
            <Badge variant="primary">Primary</Badge>
          </Box>

          <Divider width={50} />

          <Box gap={1} alignItems="center">
            <Text>Keyboard:</Text>
            <Kbd>Ctrl</Kbd>
            <Text>+</Text>
            <Kbd>C</Kbd>
            <Text> to copy, </Text>
            <Kbd>Esc</Kbd>
            <Text> to exit</Text>
          </Box>

          <Divider width={50} />

          <Label required>Required Field Label</Label>
          <Label description="This is a description">With Description</Label>

          <Divider width={50} />

          <Breadcrumb
            items={[
              { label: "Home" },
              { label: "Components" },
              { label: "Display", active: true },
            ]}
          />

          <ThemedText color="muted">ESC to go back</ThemedText>
        </Box>
      </Panel>
    </Box>
  );
}

function LayoutDemo() {
  const [expandedAccordion, setExpandedAccordion] = useState<string[]>([
    "section1",
  ]);

  interface TableRow {
    name: string;
    status: string;
    role: string;
  }

  const tableColumns = [
    { header: "Name", accessor: "name" as const, width: 15 },
    { header: "Status", accessor: "status" as const, width: 10 },
    { header: "Role", accessor: "role" as const, width: 12 },
  ];

  const tableData: TableRow[] = [
    { name: "Alice", status: "Active", role: "Admin" },
    { name: "Bob", status: "Inactive", role: "User" },
    { name: "Charlie", status: "Active", role: "Editor" },
    { name: "Diana", status: "Active", role: "User" },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Layout Components" borderStyle="round">
        <FocusGroup>
          <Box flexDirection="column" gap={1}>
            <Card title="Card Component" description="A container with border">
              <Text>This is the card content area.</Text>
            </Card>

            <Separator width={50} label="Separator" />

            <Accordion
              items={[
                {
                  key: "section1",
                  title: "Section 1",
                  content: "Content for section 1",
                },
                {
                  key: "section2",
                  title: "Section 2",
                  content: "Content for section 2",
                },
                {
                  key: "section3",
                  title: "Section 3",
                  content: "Content for section 3",
                },
              ]}
              expandedKeys={expandedAccordion}
              onChange={setExpandedAccordion}
              focusId="accordion"
            />

            <Divider width={50} />

            <Table<TableRow>
              columns={tableColumns}
              data={tableData}
              onSelect={(row) => console.log("Selected:", row)}
              focusId="table"
            />

            <Separator orientation="horizontal" />

            <ThemedText color="muted">
              TAB to switch, Up/Down to navigate
            </ThemedText>
            <ThemedText color="muted">ESC to go back</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function NewComponentsDemo() {
  const [otpValue, setOtpValue] = useState("");
  const [toggleGroupValue, setToggleGroupValue] = useState("left");
  const [collapsibleOpen, setCollapsibleOpen] = useState(true);

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="New Components (9 New!)" borderStyle="round">
        <FocusGroup>
          <Box flexDirection="column" gap={1}>
            {/* Banner */}
            <Banner text="HAUK" font="block" color="#8b5cf6" />

            <Separator width={60} />

            {/* Typography */}
            <Box flexDirection="column">
              <Typography variant="h2">Typography Component</Typography>
              <Typography variant="body" color="muted">
                Supports h1-h4, body, small, code, quote, lead variants
              </Typography>
              <Typography variant="code">const x = 42;</Typography>
            </Box>

            <Separator width={60} />

            {/* Field with Input */}
            <Field
              label="Email Address"
              required
              description="We'll never share your email"
            >
              <Text color="gray">[email input would go here]</Text>
            </Field>

            <Separator width={60} />

            {/* InputOTP */}
            <Box flexDirection="column">
              <Text bold>OTP Input:</Text>
              <InputOTP
                length={6}
                value={otpValue}
                onChange={setOtpValue}
                onComplete={(v) => console.log("OTP Complete:", v)}
                focusId="otp"
                label="Enter verification code"
              />
            </Box>

            <Separator width={60} />

            {/* ToggleGroup */}
            <Box flexDirection="column">
              <Text bold>Toggle Group:</Text>
              <ToggleGroup
                items={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                value={toggleGroupValue}
                onChange={(v) => setToggleGroupValue(v as string)}
                focusId="toggle-group"
              />
            </Box>

            <Separator width={60} />

            {/* Collapsible */}
            <Collapsible
              title="Collapsible Section (Space to toggle)"
              open={collapsibleOpen}
              onOpenChange={setCollapsibleOpen}
              focusId="collapsible"
            >
              <Box paddingLeft={2}>
                <Text>This content can be expanded or collapsed!</Text>
              </Box>
            </Collapsible>

            <Separator width={60} />

            {/* Empty State */}
            <Empty
              title="No items yet"
              description="Add some items to get started"
              icon="📭"
              size="sm"
            />

            <Separator width={60} />

            {/* ScrollArea */}
            <Box flexDirection="column">
              <Text bold>Scroll Area (focus and use j/k):</Text>
              <ScrollArea height={3} focusId="scroll-area">
                <Text>Line 1: First line of content</Text>
                <Text>Line 2: Second line of content</Text>
                <Text>Line 3: Third line of content</Text>
                <Text>Line 4: Fourth line of content</Text>
                <Text>Line 5: Fifth line of content</Text>
                <Text>Line 6: Sixth line of content</Text>
              </ScrollArea>
            </Box>

            <Divider width={60} />
            <ThemedText color="muted">
              TAB to navigate, Space/Enter to interact
            </ThemedText>
            <ThemedText color="muted">ESC to go back</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function CommandPaletteDemo() {
  const [result, setResult] = useState<string | null>(null);

  const commandItems = [
    {
      id: "new-file",
      label: "New File",
      description: "Create a new file",
      shortcut: "Ctrl+N",
      group: "File",
    },
    {
      id: "open-file",
      label: "Open File",
      description: "Open an existing file",
      shortcut: "Ctrl+O",
      group: "File",
    },
    {
      id: "save",
      label: "Save",
      description: "Save current file",
      shortcut: "Ctrl+S",
      group: "File",
    },
    {
      id: "copy",
      label: "Copy",
      description: "Copy selection",
      shortcut: "Ctrl+C",
      group: "Edit",
    },
    {
      id: "paste",
      label: "Paste",
      description: "Paste from clipboard",
      shortcut: "Ctrl+V",
      group: "Edit",
    },
    {
      id: "find",
      label: "Find",
      description: "Find in file",
      shortcut: "Ctrl+F",
      group: "Edit",
    },
    {
      id: "settings",
      label: "Settings",
      description: "Open settings",
      shortcut: "Ctrl+,",
      group: "Preferences",
    },
    {
      id: "theme",
      label: "Toggle Theme",
      description: "Switch between light and dark",
      group: "Preferences",
    },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Command Palette Demo" borderStyle="round">
        <FocusGroup initialFocusId="command">
          <Box flexDirection="column" gap={1}>
            {result && (
              <Alert variant="success" title="Command Selected">
                You selected: {result}
              </Alert>
            )}

            <Command
              items={commandItems}
              placeholder="Type to search commands..."
              title="Command Palette"
              onSelect={(item) => setResult(item.label)}
              focusId="command"
              maxItems={6}
            />

            <Divider width={50} />
            <ThemedText color="muted">
              Type to filter, Up/Down to navigate, Enter to select
            </ThemedText>
            <ThemedText color="muted">ESC to go back</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function OverlaysDemo() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertResult, setAlertResult] = useState<string | null>(null);

  useInput((input) => {
    if (input === "d") setShowDrawer(!showDrawer);
    if (input === "s") setShowSheet(!showSheet);
    if (input === "p") setShowPopover(!showPopover);
    if (input === "a") setShowAlertDialog(true);
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Panel
        title="Overlay Components (Drawer, Sheet, Popover, Tooltip, AlertDialog)"
        borderStyle="round"
      >
        <FocusGroup>
          <Box flexDirection="column" gap={1}>
            <Box gap={2}>
              <Button focusId="drawer-btn" onPress={() => setShowDrawer(true)}>
                Open Drawer (D)
              </Button>
              <Button focusId="sheet-btn" onPress={() => setShowSheet(true)}>
                Open Sheet (S)
              </Button>
              <Button
                focusId="popover-btn"
                onPress={() => setShowPopover(!showPopover)}
              >
                Toggle Popover (P)
              </Button>
            </Box>

            <Box gap={2}>
              <Button
                focusId="alert-btn"
                variant="danger"
                onPress={() => setShowAlertDialog(true)}
              >
                Show Alert Dialog (A)
              </Button>
            </Box>

            <Separator width={60} />

            {/* Tooltip Demo */}
            <Box flexDirection="column" gap={1}>
              <Text bold>Tooltips:</Text>
              <Box gap={2}>
                <Tooltip
                  content="This is a top tooltip"
                  position="top"
                  visible={false}
                >
                  <Badge>Hover Top</Badge>
                </Tooltip>
                <Tooltip
                  content="This is a bottom tooltip"
                  position="bottom"
                  visible={false}
                >
                  <Badge variant="primary">Hover Bottom</Badge>
                </Tooltip>
                <Tooltip
                  content="Left side info"
                  position="left"
                  visible={false}
                >
                  <Badge variant="success">Hover Left</Badge>
                </Tooltip>
                <Tooltip
                  content="Right side info"
                  position="right"
                  visible={true}
                >
                  <Badge variant="warning">Tooltip Open</Badge>
                </Tooltip>
              </Box>
            </Box>

            <Separator width={60} />

            {alertResult && (
              <Alert
                variant={alertResult === "confirmed" ? "success" : "info"}
                title="Alert Dialog Result"
              >
                User {alertResult} the action
              </Alert>
            )}

            {/* Drawer */}
            {showDrawer && (
              <Drawer
                open={showDrawer}
                onClose={() => setShowDrawer(false)}
                side="right"
                title="Settings Drawer"
                size={40}
                focusId="drawer"
              >
                <Box flexDirection="column" gap={1}>
                  <Text>This is a drawer sliding from the right.</Text>
                  <Text>Press ESC to close.</Text>
                  <Separator width={30} />
                  <Toggle
                    label="Dark Mode"
                    value={false}
                    onChange={() => {}}
                    focusId="drawer-toggle"
                  />
                </Box>
              </Drawer>
            )}

            {/* Sheet */}
            {showSheet && (
              <Sheet
                open={showSheet}
                onClose={() => setShowSheet(false)}
                side="bottom"
                title="Action Sheet"
                description="Choose an action to perform"
                focusId="sheet"
              >
                <Box flexDirection="column" gap={1}>
                  <Button
                    focusId="sheet-action1"
                    onPress={() => setShowSheet(false)}
                  >
                    Action 1
                  </Button>
                  <Button
                    focusId="sheet-action2"
                    onPress={() => setShowSheet(false)}
                  >
                    Action 2
                  </Button>
                  <Button
                    focusId="sheet-cancel"
                    variant="ghost"
                    onPress={() => setShowSheet(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Sheet>
            )}

            {/* Popover */}
            <Box flexDirection="column">
              <Text bold>Popover Demo:</Text>
              <Popover
                open={showPopover}
                content={
                  <Box flexDirection="column" gap={1}>
                    <Text>Popover content here</Text>
                    <Text color="gray">Press P to toggle</Text>
                  </Box>
                }
                position="bottom"
                title="Quick Actions"
                focusId="popover"
              >
                <Text>[Popover Trigger]</Text>
              </Popover>
            </Box>

            {/* Alert Dialog */}
            {showAlertDialog && (
              <AlertDialog
                open={showAlertDialog}
                onClose={() => setShowAlertDialog(false)}
                title="Delete Item?"
                description="This action cannot be undone. Are you sure you want to delete this item permanently?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
                onConfirm={() => {
                  setAlertResult("confirmed");
                  setShowAlertDialog(false);
                }}
                onCancel={() => {
                  setAlertResult("cancelled");
                  setShowAlertDialog(false);
                }}
                focusId="alert-dialog"
              />
            )}

            <Divider width={60} />
            <ThemedText color="muted">
              Press D/S/P/A to toggle overlays, TAB to navigate
            </ThemedText>
            <ThemedText color="muted">ESC to go back</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

function MenusDemo() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [comboValue, setComboValue] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useInput((input) => {
    if (input === "d") setShowDropdown(!showDropdown);
    if (input === "c") setShowContext(!showContext);
  });

  const dropdownItems = [
    { id: "profile", label: "Profile", shortcut: "Ctrl+P" },
    { id: "settings", label: "Settings", shortcut: "Ctrl+," },
    { id: "separator1", label: "", separator: true },
    { id: "help", label: "Help", icon: "?" },
    { id: "logout", label: "Logout" },
  ];

  const contextItems = [
    { id: "cut", label: "Cut", shortcut: "Ctrl+X" },
    { id: "copy", label: "Copy", shortcut: "Ctrl+C" },
    { id: "paste", label: "Paste", shortcut: "Ctrl+V" },
    { id: "separator1", label: "", separator: true },
    { id: "delete", label: "Delete", danger: true },
  ];

  const menubarItems = [
    {
      id: "file",
      label: "File",
      items: [
        { id: "new", label: "New", shortcut: "Ctrl+N" },
        { id: "open", label: "Open", shortcut: "Ctrl+O" },
        { id: "save", label: "Save", shortcut: "Ctrl+S" },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        { id: "undo", label: "Undo", shortcut: "Ctrl+Z" },
        { id: "redo", label: "Redo", shortcut: "Ctrl+Y" },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        { id: "zoom-in", label: "Zoom In" },
        { id: "zoom-out", label: "Zoom Out" },
      ],
    },
  ];

  const sidebarItems = [
    { id: "home", label: "Home", icon: "~" },
    { id: "dashboard", label: "Dashboard", icon: "#" },
    {
      id: "projects",
      label: "Projects",
      icon: ">",
      children: [
        { id: "project1", label: "Project Alpha" },
        { id: "project2", label: "Project Beta" },
      ],
    },
    { id: "settings", label: "Settings", icon: "*" },
  ];

  const comboOptions = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "solid", label: "Solid" },
    { value: "preact", label: "Preact" },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Panel
        title="Menu Components (DropdownMenu, ContextMenu, Menubar, Sidebar, Combobox)"
        borderStyle="round"
      >
        <FocusGroup>
          <Box flexDirection="column" gap={1}>
            {selectedAction && (
              <Alert variant="info" title="Action Selected">
                {selectedAction}
              </Alert>
            )}

            {/* Menubar */}
            <Box flexDirection="column">
              <Text bold>Menubar:</Text>
              <Menubar
                items={menubarItems}
                onSelect={(menuId, itemId) =>
                  setSelectedAction(`Menubar: ${menuId} > ${itemId}`)
                }
                focusId="menubar"
              />
            </Box>

            <Separator width={60} />

            {/* Combobox */}
            <Box flexDirection="column">
              <Text bold>Combobox (searchable select):</Text>
              <Combobox
                options={comboOptions}
                value={comboValue}
                onChange={setComboValue}
                placeholder="Search frameworks..."
                focusId="combobox"
              />
            </Box>

            <Separator width={60} />

            {/* Dropdown and Context Menu triggers */}
            <Box gap={2}>
              <Button
                focusId="dropdown-btn"
                onPress={() => setShowDropdown(!showDropdown)}
              >
                Dropdown Menu (D)
              </Button>
              <Button
                focusId="context-btn"
                onPress={() => setShowContext(!showContext)}
              >
                Context Menu (C)
              </Button>
              <Button
                focusId="sidebar-btn"
                onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                Toggle Sidebar
              </Button>
            </Box>

            {/* Dropdown Menu */}
            {showDropdown && (
              <DropdownMenu
                items={dropdownItems}
                open={showDropdown}
                onSelect={(item) => {
                  setSelectedAction(`Dropdown: ${item.label}`);
                  setShowDropdown(false);
                }}
                onClose={() => setShowDropdown(false)}
                focusId="dropdown"
              />
            )}

            {/* Context Menu */}
            {showContext && (
              <ContextMenu
                items={contextItems}
                open={showContext}
                onSelect={(item) => {
                  setSelectedAction(`Context: ${item.label}`);
                  setShowContext(false);
                }}
                onClose={() => setShowContext(false)}
                focusId="context"
              />
            )}

            <Separator width={60} />

            {/* Sidebar */}
            <Box flexDirection="column">
              <Text bold>
                Sidebar {sidebarCollapsed ? "(Collapsed)" : "(Expanded)"}:
              </Text>
              <Sidebar
                items={sidebarItems}
                collapsed={sidebarCollapsed}
                onChange={(id) => setSelectedAction(`Sidebar: ${id}`)}
                focusId="sidebar"
              />
            </Box>

            <Divider width={60} />
            <ThemedText color="muted">
              Press D/C to toggle menus, TAB to navigate between components
            </ThemedText>
            <ThemedText color="muted">ESC to go back</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}

render(<App />);

function DataFormsDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [switchValue, setSwitchValue] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const chartData = [
    { label: "Jan", value: 65 },
    { label: "Feb", value: 85 },
    { label: "Mar", value: 45 },
    { label: "Apr", value: 95 },
    { label: "May", value: 70 },
    { label: "Jun", value: 80 },
  ];

  const tableColumns = [
    { header: "Name", accessor: "name" as const, width: 15, sortable: true },
    {
      header: "Status",
      accessor: "status" as const,
      width: 10,
      sortable: true,
    },
    { header: "Role", accessor: "role" as const, width: 12, sortable: true },
    { header: "Email", accessor: "email" as const, width: 25 },
  ];

  const tableData = [
    {
      name: "Alice",
      status: "Active",
      role: "Admin",
      email: "alice@example.com",
    },
    { name: "Bob", status: "Inactive", role: "User", email: "bob@example.com" },
    {
      name: "Charlie",
      status: "Active",
      role: "Editor",
      email: "charlie@example.com",
    },
    {
      name: "Diana",
      status: "Active",
      role: "User",
      email: "diana@example.com",
    },
    { name: "Eve", status: "Pending", role: "User", email: "eve@example.com" },
  ];

  const navItems = [
    {
      id: "home",
      label: "Home",
    },
    {
      id: "products",
      label: "Products",
      children: [
        { id: "all", label: "All Products" },
        { id: "new", label: "New Arrivals" },
      ],
    },
    {
      id: "about",
      label: "About",
    },
  ];

  const carouselItems = [
    { id: "1", content: <Text>Slide 1: Welcome to haukTUI</Text> },
    { id: "2", content: <Text>Slide 2: Build beautiful TUIs</Text> },
    { id: "3", content: <Text>Slide 3: 57+ Components</Text> },
    { id: "4", content: <Text>Slide 4: Fully keyboard navigable</Text> },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Panel title="Data & Forms (10 New Components)" borderStyle="round">
        <FocusGroup>
          <Box flexDirection="column" gap={1}>
            {/* Switch */}
            <Box gap={2} alignItems="center">
              <Text bold>Switch:</Text>
              <Switch
                checked={switchValue}
                onCheckedChange={setSwitchValue}
                focusId="switch"
                label="Enable feature"
              />
            </Box>

            <Separator width={60} />

            {/* Chart */}
            <Box flexDirection="column">
              <Text bold>Bar Chart:</Text>
              <Chart data={chartData} type="bar" showLabels />
            </Box>

            <Separator width={60} />

            {/* Sparkline */}
            <Box gap={2} alignItems="center">
              <Text bold>Sparkline:</Text>
              <Chart data={chartData} type="sparkline" />
            </Box>

            <Separator width={60} />

            {/* Calendar */}
            <Box flexDirection="column">
              <Text bold>Calendar:</Text>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                focusId="calendar"
              />
              {selectedDate && (
                <Text color="green">
                  Selected: {selectedDate.toDateString()}
                </Text>
              )}
            </Box>

            <Separator width={60} />

            {/* DatePicker */}
            <Box flexDirection="column">
              <Text bold>Date Picker:</Text>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                focusId="date-picker"
                placeholder="Select a date..."
              />
            </Box>

            <Separator width={60} />

            {/* Carousel */}
            <Box flexDirection="column">
              <Text bold>Carousel:</Text>
              <Carousel
                items={carouselItems}
                activeIndex={carouselIndex}
                onChange={setCarouselIndex}
                focusId="carousel"
                showDots
              />
            </Box>

            <Separator width={60} />

            {/* DataTable */}
            <Box flexDirection="column">
              <Text bold>Data Table (sortable):</Text>
              <DataTable
                columns={tableColumns}
                data={tableData}
                focusId="data-table"
                striped
                showRowNumbers
                onSelect={(row) => console.log("Selected:", row)}
              />
            </Box>

            <Separator width={60} />

            {/* NavigationMenu */}
            <Box flexDirection="column">
              <Text bold>Navigation Menu:</Text>
              <NavigationMenu
                items={navItems}
                focusId="nav-menu"
                onSelect={(id) => console.log("Nav selected:", id)}
              />
            </Box>

            <Separator width={60} />

            {/* HoverCard */}
            <Box flexDirection="column">
              <Text bold>Hover Card:</Text>
              <HoverCard
                content={
                  <Box flexDirection="column">
                    <Text bold>User Profile</Text>
                    <Text color="gray">Additional info appears here</Text>
                  </Box>
                }
                position="right"
                open
              >
                <Badge variant="primary">Hover/Focus for info</Badge>
              </HoverCard>
            </Box>

            <Separator width={60} />

            {/* Form */}
            <Box flexDirection="column">
              <Text bold>Form with Validation:</Text>
              <Form onSubmit={(data) => console.log("Form submitted:", data)}>
                <FormField name="username" label="Username" required>
                  <Text color="gray">[Text input]</Text>
                </FormField>
                <FormMessage type="error">Username is required</FormMessage>
              </Form>
            </Box>

            <Divider width={60} />
            <ThemedText color="muted">
              TAB to navigate, Arrow keys within components
            </ThemedText>
            <ThemedText color="muted">ESC to go back</ThemedText>
          </Box>
        </FocusGroup>
      </Panel>
    </Box>
  );
}
