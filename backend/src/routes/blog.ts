import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@abhisheky97/medium-common";

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	};
	Variables: {
		userId: string;
	};
}>();

blogRouter.use("/*", async (c, next) => {
	const authHeader = c.req.header("authorization") || "";
	try {
		const user = await verify(authHeader, c.env.JWT_SECRET);
		if (user) {
			c.set("userId", user.id);
			await next();
		} else {
			c.status(403);
			return c.json({
				error: "Not logged in",
			});
		}
	} catch (e) {
		console.error(e);
		c.status(403);
		return c.json({
			error: "Not logged in",
		});
	}
});

blogRouter.post("/", async (c) => {
	try {
		const body = await c.req.json();
		const { success } = createBlogInput.safeParse(body);
		if (!success) {
			c.status(411);
			return c.json({
				message: "Inputs not correct",
			});
		}
		const authorId = c.get("userId");
		if (!authorId) {
			c.status(401);
			return c.json({
				error: "Unauthorized",
			});
		}
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		const blog = await prisma.blog.create({
			data: {
				title: body.title,
				content: body.content,
				authorId: Number(authorId),
			},
		});
		return c.json({
			id: blog.id,
		});
	} catch (e) {
		console.error(e);
		c.status(500);
		return c.json({
			error: "Internal Server Error",
		});
	}
});

blogRouter.put("/", async (c) => {
	const body = await c.req.json();
	const { success } = updateBlogInput.safeParse(body);
	if (!success) {
		c.status(411);
		return c.json({
			message: "Inputs not correct",
		});
	}
	try {
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		const blog = await prisma.blog.update({
			where: { id: body.id },
			data: {
				title: body.title,
				content: body.content,
			},
		});
		return c.json({
			id: blog.id,
		});
	} catch (e) {
		console.error(e);
		c.status(500);
		return c.json({
			error: "Internal Server Error",
		});
	}
});

blogRouter.get("/bulk", async (c) => {
	try {
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());
		const blogs = await prisma.blog.findMany();
		return c.json({ blogs });
	} catch (e) {
		console.error(e);
		c.status(500);
		return c.json({
			error: "Internal Server Error",
		});
	}
});

blogRouter.get("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		const blog = await prisma.blog.findFirst({
			where: { id: Number(id) },
		});
		const author = await prisma.user.findUnique({
			where: { id: blog?.authorId },
			select: {
				id: true,
				name: true,
				username: true,
				blogs: true,
			},
		});
		if (!blog) {
			c.status(404);
			return c.json({
				error: "Blog not found",
			});
		}
		return c.json({
			blog,
			author,
		});
	} catch (e) {
		console.error(e);
		c.status(500);
		return c.json({
			error: "Internal Server Error",
		});
	}
});
