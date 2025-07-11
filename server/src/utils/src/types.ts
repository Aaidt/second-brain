import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const AuthSchema = z.object({
  username: z
    .string()
    .min(8, {
      message: "username must be atleast 8 characters long.",
    })
    .email({
      message: "Invalid email address.",
    })
    .endsWith(".com", {
      message: "Invalid mail address",
    }),

  password: z.string().min(8, {
    message: "password must be atleast 8 characters long.",
  }),
});

export function validateAuth(req: Request, res: Response, next: NextFunction) {
  const parsedData = AuthSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      error: parsedData.error.format(),
    });
  } else {
    next();
  }
}

const ContentSchema = z.object({
  title: z.string(),
  link: z.string(),
  type: z.string(),
});

export function validateContent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parsedData = ContentSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      error: parsedData.error.format(),
    });
  } else {
    next();
  }
}

const ThoughtSchema = z.object({
  title: z.string(),
  thoughts: z.string()
})

export function validateThought(req: Request, res: Response, next: NextFunction) {
  const parsedData = ThoughtSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      error: parsedData.error.format(),
    });
  } else {
    next();
  }
}

const ChatMessageSchema = z.object({
  sender: z.enum(['user', 'ai']),
  content: z.string()
});

export function validateChatMessage(req: Request, res: Response, next: NextFunction) {
  const parsedData = ChatMessageSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      error: parsedData.error.format(),
    });
  } else {
    next();
  }
}

const ChatSessionSchema = z.object({
  title: z.string().min(3).max(20)
});

export function validateChatSession(req: Request, res: Response, next: NextFunction) {
  const parsedData = ChatSessionSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      error: parsedData.error.format(),
    });
  } else {
    next();
  }
}

