# Nextjs 14 + shadcn/ui + react-hook-forms + useSWR + drizzle

A demo of some of the concepts learned from my last freelance project  
The only difference is instead of a seperate expressjs API and mongodb, this demo project will use drizzle, vercel
postgres and nextjs api routes. I wont be using server components and server actions just so this demo is as similar
to the existing project, same goes for auth token instead of cookies. This would also be my first drizzle learninglog

<https://nxt14-shdcn-rhf-swr.vercel.app/>

## Simplest Carousel Ever

## getServerSideProps + promise.all + apiFetch util + swr config + swr immutable

## react-hook-forms + axios client + swr + auth state

## app router used for cms parts and pages router for public website

Which also includes handling of Dhivehi and English layouts within the pages router

## day.js and SSR safe time formatting

## My homebrewn rich text editor based on slatejs

> **Image upload is left out entirely**  
> **Only Media Center -> News is accessible**  
> **Some advanced API options left out**

### To run Drizzle migrations

`POSTGRES_URL="postgres://...?sslmode=off" pnpm drizzle-kit push:pg`
