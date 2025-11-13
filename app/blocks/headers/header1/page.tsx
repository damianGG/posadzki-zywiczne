'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Moon, Search, ChevronDown, Menu } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const DesktopNavItems = () => (
    <>
      <Link href="/features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        Features
      </Link>
      <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        About
      </Link>
      <Link href="/portfolio" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        Portfolio
      </Link>
      <Link href="/pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        Pricing
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          Pages <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[400px] md:w-[600px] p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Our Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/services/web-development" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/services/mobile-apps" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link href="/services/cloud-solutions" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Cloud Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/resources/blog" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/resources/case-studies" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/resources/documentation" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Image
              src="/placeholder.svg?height=100&width=400"
              alt="Featured Image"
              width={400}
              height={100}
              className="rounded-lg object-cover"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )

  const MobileNavItems = () => (
    <>
      <Link href="/features" className="py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        Features
      </Link>
      <Link href="/about" className="py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        About
      </Link>
      <Link href="/portfolio" className="py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        Portfolio
      </Link>
      <Link href="/pricing" className="py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        Pricing
      </Link>
      <Accordion type="single" collapsible>
        <AccordionItem value="pages">
          <AccordionTrigger>Pages</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold mt-2">Our Services</h3>
              <Link href="/services/web-development" className="py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Web Development
              </Link>
              <Link href="/services/mobile-apps" className="py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Mobile Apps
              </Link>
              <Link href="/services/cloud-solutions" className="py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Cloud Solutions
              </Link>
              <h3 className="font-semibold mt-2">Resources</h3>
              <Link href="/resources/blog" className="py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Blog
              </Link>
              <Link href="/resources/case-studies" className="py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Case Studies
              </Link>
              <Link href="/resources/documentation" className="py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Documentation
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
          <span className="text-xl font-bold">GoStartup</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <DesktopNavItems />
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="default">Sign In</Button>
          <Button variant="outline">Sign Up</Button>
        </div>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Moon className="h-5 w-5" />
        </Button>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-4">
              <MobileNavItems />
              <Button variant="default" className="w-full">Sign In</Button>
              <Button variant="outline" className="w-full">Sign Up</Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}