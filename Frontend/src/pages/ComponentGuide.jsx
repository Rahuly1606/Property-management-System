import React, { useState } from 'react';
import {
    // Layout
    Container,
    Row,
    Col,
    Grid,
    Section,
    Divider,

    // Animation
    Fade,
    Slide,
    HoverEffect,

    // Accessibility
    SkipToContent,
    VisuallyHidden,

    // Data Display
    Badge,
    PriceDisplay,
    PropertyStats,
    FeatureList,
    PropertyStatus,
    Rating,

    // Re-exported components
    Button,
    Card,
    PropertyCard,
    Input,
    Select,
    Checkbox,
    FormControl,
    FormLabel,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useModal,
    useToast,
    Toast,
    PropertyCardSkeleton,
} from '../components/common';

/**
 * Component Guide
 * 
 * This page showcases all components in the PropertyHub design system
 * and serves as documentation for developers.
 */
const ComponentGuide = () => {
    const { isOpen, openModal, closeModal } = useModal();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('layout');

    // Example property data
    const propertyData = {
        id: 1,
        title: 'Modern Apartment with Garden View',
        price: 2500,
        priceType: 'rent',
        rentPeriod: 'month',
        address: {
            street: '123 Main Street',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94103',
        },
        stats: [
            { value: 2, label: 'beds' },
            { value: 2, label: 'baths' },
            { value: 1200, label: 'sq ft' },
        ],
        features: [
            { icon: '✓', label: 'Air Conditioning' },
            { icon: '✓', label: 'Dishwasher' },
            { icon: '✓', label: 'Hardwood Floors' },
            { icon: '✓', label: 'In-unit Laundry' },
            { icon: '✓', label: 'Balcony' },
            { icon: '✓', label: 'Pets Allowed' },
        ],
        status: 'available',
        rating: 4.5,
        image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image',
    };

    // Show toast example
    const showToast = (type) => {
        toast({
            type,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
            message: `This is an example of a ${type} toast notification.`,
            duration: 3000,
        });
    };

    return (
        <div className="bg-white min-h-screen">
            <SkipToContent />

            {/* Header */}
            <header className="bg-primary-700 text-white py-6">
                <Container>
                    <h1 className="text-3xl font-bold">PropertyHub Design System</h1>
                    <p className="mt-2">Component guide and documentation</p>
                </Container>
            </header>

            {/* Navigation */}
            <div className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                <Container>
                    <div className="flex overflow-x-auto py-2 space-x-4">
                        {['layout', 'typography', 'buttons', 'forms', 'cards', 'data-display', 'feedback', 'accessibility', 'animations'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 font-medium rounded-md whitespace-nowrap ${activeTab === tab
                                        ? 'bg-primary-100 text-primary-800'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Main Content */}
            <main id="main-content" className="py-12">
                <Container>
                    {/* Layout Section */}
                    {activeTab === 'layout' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Layout Components</h2>

                            <h3 className="text-xl font-semibold mt-8 mb-4">Container</h3>
                            <div className="bg-primary-100 p-4 mb-8">
                                <Container className="bg-primary-200 p-4 text-center">
                                    <p>Standard Container (max-width with responsive padding)</p>
                                </Container>

                                <Container fluid className="bg-primary-300 p-4 mt-4 text-center">
                                    <p>Fluid Container (100% width with responsive padding)</p>
                                </Container>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Grid System</h3>
                            <p className="mb-4">Row and Col Components</p>
                            <Row className="mb-6">
                                <Col span={{ sm: 12, md: 6, lg: 4 }} className="bg-accent-100 p-4 text-center">
                                    <div className="p-4 bg-accent-200">Column 1</div>
                                </Col>
                                <Col span={{ sm: 12, md: 6, lg: 4 }} className="bg-accent-100 p-4 text-center">
                                    <div className="p-4 bg-accent-200">Column 2</div>
                                </Col>
                                <Col span={{ sm: 12, md: 12, lg: 4 }} className="bg-accent-100 p-4 text-center">
                                    <div className="p-4 bg-accent-200">Column 3</div>
                                </Col>
                            </Row>

                            <p className="mb-4">Grid Component</p>
                            <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap={4} className="mb-8">
                                <div className="bg-primary-100 p-4 text-center">Grid Item 1</div>
                                <div className="bg-primary-100 p-4 text-center">Grid Item 2</div>
                                <div className="bg-primary-100 p-4 text-center">Grid Item 3</div>
                                <div className="bg-primary-100 p-4 text-center">Grid Item 4</div>
                                <div className="bg-primary-100 p-4 text-center">Grid Item 5</div>
                                <div className="bg-primary-100 p-4 text-center">Grid Item 6</div>
                            </Grid>

                            <h3 className="text-xl font-semibold mb-4">Section & Divider</h3>
                            <Section bg="gray" spacing="small" className="mb-4 rounded-lg">
                                <p className="text-center">Section with gray background and small spacing</p>
                            </Section>

                            <Divider className="my-8" />

                            <p className="text-center">Content after divider</p>
                        </Section>
                    )}

                    {/* Typography Section */}
                    {activeTab === 'typography' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Typography</h2>

                            <h3 className="text-xl font-semibold mb-4">Headings</h3>
                            <div className="space-y-4 mb-8">
                                <h1 className="text-5xl font-bold">Heading 1 (48px)</h1>
                                <h2 className="text-4xl font-bold">Heading 2 (36px)</h2>
                                <h3 className="text-3xl font-bold">Heading 3 (30px)</h3>
                                <h4 className="text-2xl font-bold">Heading 4 (24px)</h4>
                                <h5 className="text-xl font-bold">Heading 5 (20px)</h5>
                                <h6 className="text-lg font-bold">Heading 6 (18px)</h6>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Body Text</h3>
                            <div className="space-y-4 mb-8">
                                <p className="text-base">
                                    Default body text (16px). Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
                                </p>
                                <p className="text-sm">
                                    Small text (14px). Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </p>
                                <p className="text-xs">
                                    Extra small text (12px). Lorem ipsum dolor sit amet.
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Text Styles</h3>
                            <div className="space-y-4">
                                <p className="font-light">Light text weight</p>
                                <p className="font-normal">Normal text weight</p>
                                <p className="font-medium">Medium text weight</p>
                                <p className="font-semibold">Semi-bold text weight</p>
                                <p className="font-bold">Bold text weight</p>
                                <p className="italic">Italic text style</p>
                                <p className="underline">Underlined text</p>
                                <p className="text-primary-600">Primary colored text</p>
                                <p className="text-accent-600">Accent colored text</p>
                            </div>
                        </Section>
                    )}

                    {/* Buttons Section */}
                    {activeTab === 'buttons' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Buttons</h2>

                            <h3 className="text-xl font-semibold mb-4">Button Variants</h3>
                            <div className="flex flex-wrap gap-4 mb-8">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="accent">Accent</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Button Sizes</h3>
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <Button size="sm">Small</Button>
                                <Button>Default</Button>
                                <Button size="lg">Large</Button>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Button States</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button>Default</Button>
                                <Button disabled>Disabled</Button>
                                <Button loading>Loading</Button>
                                <Button fullWidth className="mt-4">Full Width</Button>
                            </div>
                        </Section>
                    )}

                    {/* Forms Section */}
                    {activeTab === 'forms' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Form Components</h2>

                            <Row>
                                <Col span={{ sm: 12, md: 6 }} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Text Inputs</h3>

                                    <FormControl className="mb-4">
                                        <FormLabel htmlFor="default-input">Default Input</FormLabel>
                                        <Input id="default-input" placeholder="Enter text here" />
                                    </FormControl>

                                    <FormControl className="mb-4">
                                        <FormLabel htmlFor="disabled-input">Disabled Input</FormLabel>
                                        <Input id="disabled-input" placeholder="Disabled input" disabled />
                                    </FormControl>

                                    <FormControl className="mb-4" error="This field is required">
                                        <FormLabel htmlFor="error-input">Input with Error</FormLabel>
                                        <Input id="error-input" placeholder="Error state" error />
                                    </FormControl>

                                    <FormControl className="mb-4">
                                        <FormLabel htmlFor="success-input">Input with Success</FormLabel>
                                        <Input id="success-input" placeholder="Success state" success />
                                    </FormControl>
                                </Col>

                                <Col span={{ sm: 12, md: 6 }} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Select & Checkbox</h3>

                                    <FormControl className="mb-4">
                                        <FormLabel htmlFor="select-input">Select Input</FormLabel>
                                        <Select id="select-input">
                                            <option value="">Select an option</option>
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl className="mb-4">
                                        <Checkbox id="checkbox-1" label="Default Checkbox" />
                                    </FormControl>

                                    <FormControl className="mb-4">
                                        <Checkbox id="checkbox-2" label="Checked Checkbox" defaultChecked />
                                    </FormControl>

                                    <FormControl className="mb-4">
                                        <Checkbox id="checkbox-3" label="Disabled Checkbox" disabled />
                                    </FormControl>
                                </Col>
                            </Row>
                        </Section>
                    )}

                    {/* Cards Section */}
                    {activeTab === 'cards' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Cards</h2>

                            <h3 className="text-xl font-semibold mb-4">Basic Card</h3>
                            <Row className="mb-8">
                                <Col span={{ sm: 12, md: 6, lg: 4 }}>
                                    <Card className="h-full">
                                        <h4 className="text-lg font-semibold mb-2">Card Title</h4>
                                        <p>This is a basic card component with some content.</p>
                                        <Button className="mt-4" variant="outline" size="sm">Learn More</Button>
                                    </Card>
                                </Col>

                                <Col span={{ sm: 12, md: 6, lg: 4 }}>
                                    <Card className="h-full">
                                        <h4 className="text-lg font-semibold mb-2">Card with Image</h4>
                                        <img
                                            src="https://placehold.co/600x400/e2e8f0/1e293b?text=Card+Image"
                                            alt="Card example"
                                            className="w-full h-40 object-cover rounded-md mb-4"
                                        />
                                        <p>Card with an image and some descriptive text below it.</p>
                                    </Card>
                                </Col>

                                <Col span={{ sm: 12, md: 12, lg: 4 }}>
                                    <HoverEffect effect="float">
                                        <Card className="h-full">
                                            <h4 className="text-lg font-semibold mb-2">Interactive Card</h4>
                                            <p>This card has a hover effect applied to it.</p>
                                            <p className="text-sm text-gray-500 mt-4">Hover to see the effect</p>
                                        </Card>
                                    </HoverEffect>
                                </Col>
                            </Row>

                            <h3 className="text-xl font-semibold mb-4">Property Card</h3>
                            <Row>
                                <Col span={{ sm: 12, md: 6, lg: 4 }}>
                                    <PropertyCard
                                        title={propertyData.title}
                                        price={propertyData.price}
                                        priceType={propertyData.priceType}
                                        rentPeriod={propertyData.rentPeriod}
                                        address={propertyData.address}
                                        stats={propertyData.stats}
                                        status={propertyData.status}
                                        image={propertyData.image}
                                    />
                                </Col>

                                <Col span={{ sm: 12, md: 6, lg: 4 }}>
                                    <PropertyCardSkeleton />
                                </Col>
                            </Row>
                        </Section>
                    )}

                    {/* Data Display Section */}
                    {activeTab === 'data-display' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Data Display Components</h2>

                            <h3 className="text-xl font-semibold mb-4">Badges</h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <Badge>Default</Badge>
                                <Badge variant="primary">Primary</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="error">Error</Badge>
                                <Badge variant="info">Info</Badge>
                                <Badge variant="outline">Outline</Badge>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Price Display</h3>
                            <div className="space-y-4 mb-8">
                                <PriceDisplay amount={250000} />
                                <PriceDisplay amount={2500} period="month" />
                                <PriceDisplay amount={30000} size="lg" />
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Property Stats</h3>
                            <PropertyStats stats={propertyData.stats} className="mb-8" />

                            <h3 className="text-xl font-semibold mb-4">Feature List</h3>
                            <FeatureList features={propertyData.features} columns={2} className="mb-8" />

                            <h3 className="text-xl font-semibold mb-4">Property Status</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex flex-wrap gap-2">
                                    <PropertyStatus status="available" />
                                    <PropertyStatus status="pending" />
                                    <PropertyStatus status="sold" />
                                    <PropertyStatus status="reserved" />
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <PropertyStatus status="available" variant="text" />
                                    <PropertyStatus status="pending" variant="text" />
                                    <PropertyStatus status="sold" variant="text" />
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Rating</h3>
                            <div className="space-y-4">
                                <Rating value={5} showValue />
                                <Rating value={4.5} showValue />
                                <Rating value={3} showValue />
                            </div>
                        </Section>
                    )}

                    {/* Feedback Section */}
                    {activeTab === 'feedback' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Feedback Components</h2>

                            <h3 className="text-xl font-semibold mb-4">Modal</h3>
                            <div className="mb-8">
                                <Button onClick={openModal}>Open Modal</Button>

                                <Modal isOpen={isOpen} onClose={closeModal}>
                                    <ModalHeader>Modal Title</ModalHeader>
                                    <ModalBody>
                                        <p>This is an example modal. It can contain any content.</p>
                                        <p className="mt-4">Click the X button or the overlay to close it.</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="outline" onClick={closeModal}>Cancel</Button>
                                        <Button onClick={closeModal}>Confirm</Button>
                                    </ModalFooter>
                                </Modal>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Toast Notifications</h3>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => showToast('success')} variant="success">Success Toast</Button>
                                <Button onClick={() => showToast('error')} variant="error">Error Toast</Button>
                                <Button onClick={() => showToast('warning')} variant="warning">Warning Toast</Button>
                                <Button onClick={() => showToast('info')} variant="info">Info Toast</Button>
                            </div>

                            {/* Toast container will be rendered by the useToast hook */}
                        </Section>
                    )}

                    {/* Accessibility Section */}
                    {activeTab === 'accessibility' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Accessibility Components</h2>

                            <h3 className="text-xl font-semibold mb-4">Skip to Content</h3>
                            <p className="mb-8">A Skip to Content link is included at the top of this page. It becomes visible when focused (try pressing Tab from the beginning of the page).</p>

                            <h3 className="text-xl font-semibold mb-4">Visually Hidden</h3>
                            <div className="mb-8">
                                <p>The text below is visually hidden but accessible to screen readers:</p>
                                <VisuallyHidden>This text is only visible to screen readers.</VisuallyHidden>
                                <p className="mt-2 text-sm text-gray-500">
                                    (View the source to see the VisuallyHidden component)
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Focus Indicators</h3>
                            <p className="mb-4">All interactive elements have clear focus indicators. Try pressing Tab to navigate:</p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <Button>Focusable Button</Button>
                                <a href="#" className="text-primary-600 hover:underline">Focusable Link</a>
                                <Input className="w-48" placeholder="Focusable Input" />
                            </div>
                        </Section>
                    )}

                    {/* Animations Section */}
                    {activeTab === 'animations' && (
                        <Section>
                            <h2 className="text-2xl font-bold mb-6">Animation Components</h2>

                            <h3 className="text-xl font-semibold mb-4">Fade Animation</h3>
                            <div className="mb-8">
                                <Button
                                    onClick={() => {
                                        const fadeDemo = document.getElementById('fade-demo');
                                        fadeDemo.style.display = fadeDemo.style.display === 'none' ? 'block' : 'none';
                                    }}
                                >
                                    Toggle Fade
                                </Button>

                                <div id="fade-demo" className="mt-4">
                                    <Fade show={true} duration="normal">
                                        <div className="p-4 bg-primary-100 rounded-lg">
                                            <p>This content will fade in and out.</p>
                                        </div>
                                    </Fade>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Slide Animation</h3>
                            <div className="mb-8">
                                <Button
                                    onClick={() => {
                                        const slideDemo = document.getElementById('slide-demo');
                                        slideDemo.style.display = slideDemo.style.display === 'none' ? 'block' : 'none';
                                    }}
                                >
                                    Toggle Slide
                                </Button>

                                <div id="slide-demo" className="mt-4">
                                    <Slide show={true} direction="right">
                                        <div className="p-4 bg-accent-100 rounded-lg">
                                            <p>This content will slide in and out.</p>
                                        </div>
                                    </Slide>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Hover Effects</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <HoverEffect effect="float">
                                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                                        Float Effect
                                    </div>
                                </HoverEffect>

                                <HoverEffect effect="grow">
                                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                                        Grow Effect
                                    </div>
                                </HoverEffect>

                                <HoverEffect effect="glow">
                                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                                        Glow Effect
                                    </div>
                                </HoverEffect>
                            </div>
                        </Section>
                    )}
                </Container>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-200 py-8">
                <Container>
                    <p className="text-center text-gray-600">
                        PropertyHub Design System — Component Guide
                    </p>
                </Container>
            </footer>
        </div>
    );
};

export default ComponentGuide;