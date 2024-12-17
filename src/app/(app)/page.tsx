"use client";

import { Mail, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import messages from "../../../messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-900 text-gray-100">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-100">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-lg md:text-xl text-gray-300">
            True Feedback - Where your identity remains a secret.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              className="bg-gray-700 hover:bg-gray-600 text-gray-100"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-300">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0 text-gray-500" />
                    <div>
                      <p className="text-gray-300">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-gray-800 text-gray-400">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center space-x-4 mb-4">
            <a href="#" className="hover:text-gray-100 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-gray-100 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-100 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-100 transition-colors">
              Contact
            </a>
          </div>
          <p>© 2023 True Feedback. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
